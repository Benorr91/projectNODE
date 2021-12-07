const mongoose = require("mongoose");
const Joi = require("joi");
const jwt= require("jsonwebtoken")

let userSchema = new mongoose.Schema({
    name: String,
    pass: String,
    email: String,
    creatDate: { type: Date, default: Date.now() },
    role: { type: String, default: "regular" }
})
exports.UserModel = mongoose.model("users", userSchema);

exports.genToken=(userId)=>{
    let token= jwt.sign({id:userId},"BENorSeCret",{expiresIn:"60mins"});
    return token;

}

exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(1).max(999).required().email(),
        pass: Joi.string().min(2).max(99).required(),
    })
    return joiSchema.validate(_reqBody);
}
exports.validatelogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(1).max(999).required().email(),
        pass: Joi.string().min(2).max(99).required(),
    })
    return joiSchema.validate(_reqBody);
}