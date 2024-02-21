const {Schema, model} = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        salt: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: true
        }, 
        profileImageUrl: {
            type: String,
            required: false,
            default: '/images/default.png'
        }, 
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER'
        }   
    }, {timestamps: true});

userSchema.pre('save',function (next) {
    const user = this;

    if(!user.isModified('password')) return;

    //Create a salt which is a random string and then create a hash
    const salt = randomBytes(16).toString();

    //creates a hash with sha256 algorithm using secret which will be the salt generated above
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
    
    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function(email,password) {

    const user = await this.findOne({email});
    if(!user) throw new Error('Unable to find user');

    const userPassword = user.password;
    
    const hashedPassword = createHmac("sha256", user.salt).update(password).digest("hex");

    if(hashedPassword !== userPassword) throw new Error('Password does not match');
    
    return createTokenForUser(user);
});

const User = model('User', userSchema);

module.exports = User;