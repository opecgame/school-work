
const users = require(`../database/users.js`);
const jwt = require("jsonwebtoken")

module.exports.updateUser = async (req,res,next) =>{
    try {
        const key = res.cookies.get("pkwisfuckingschool__")
        if(key){
            const decode = jwt.verify(key, config.jwtsecret)
            const usersLocal = await users.findOne({ id: decode.id });
            if(usersLocal) {
                res.locals.user = key
            }else{
                res.clearCookie("pkwisfuckingschool__");
            }
        }else;
    } finally {
        next()
    }
}