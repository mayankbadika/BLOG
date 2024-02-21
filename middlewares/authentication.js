const { validateToken } = require('../services/authentication');
function checkAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const token = req.cookies[cookieName];
        if(!token) return next();
        
        req.user = null;

        try {
            const user = validateToken(token);
            req.user = user;
        } catch(error) {}

        return next();
    }
}

module.exports = { checkAuthenticationCookie };