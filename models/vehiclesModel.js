const mongoose = require("mongoose");
const Joi = require("joi");


let vehiclesSchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    price:Number,
    img_url:String,
    date_created: { type: Date, default: Date.now() },
    user_id:String
  
})

exports.VehiclesModel = mongoose.model("vehicles", vehiclesSchema);

exports.validateVehicles = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(9999).required(),
        category: Joi.string().min(1).max(99).required(),
        img_url: Joi.string().min(1).max(9999).required(),
        price: Joi.number().min(0).max(9999999).required(),
       
     
       
    })
    return joiSchema.validate(_reqBody);
}