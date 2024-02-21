const JWT = require('jsonwebtoken');
const secret = "$superman@1234#blogify";

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role
    };

    const token = JWT.sign(payload, secret);

    return token;
}

function validateToken(token) {
    const user = JWT.verify(token, secret);

    return user;
}

module.exports = {createTokenForUser, validateToken};