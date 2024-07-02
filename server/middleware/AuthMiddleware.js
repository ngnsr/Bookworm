const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        return next();
    } catch {
        return res.sendStatus(401);
    }

}