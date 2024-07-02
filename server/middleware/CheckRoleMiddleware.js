const jwt = require("jsonwebtoken");

module.exports = function(role){
    return function(req,res,next){

        try{
            const token = req.cookies.access_token;

            if(!token){
                return res.status(401).json({message: "Користувач не авторизований"});
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            if(decoded.role !== role && decoded.role !== "ADMIN"){
                return res.status(403).json("Немає доступу");
            }
            req.user = decoded;
            next();
        }catch(e){
            res.status(401).json({message: "Користувач не авторизований"});
        }
    }
}