const jwt= require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth=(req,res,next)=>{
    let token = req.header("x-api-key");
    if(!token){
        return res.status(401).json({msg:"you must send token to this endpoint"})
    }
    try{

        let decode= jwt.verify(token,config.tokenSecret);
        req.userToken=decode;
        next()
    }catch(err){
        console.log(err);
        res.status(401).json({msg:"your token is invalid or expired"})

    }
}