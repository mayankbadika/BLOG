const {Schema, model} = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    coverImageURl: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref : 'User'
    }
}, {timestamps: true});

const blogSchema = model('Blog', schema);

module.exports = blogSchema;