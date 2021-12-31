
const express = require("express");
const { auth } = require("../middele/auth");

const { VehiclesModel, validateVehicles } = require("../models/vehiclesModel")
const router = express.Router();

//  localhost:3000/vehicles --> to see all the vehicles 
router.get("/", async (req, res) => {
    // console.log(req.userToken.id);
    let vehiclesData = await VehiclesModel.find({})
    res.json(vehiclesData)

})
// localhost:3000/vehicles/myInfo--> to see just your vehicles
router.get("/myInfo",auth, async (req, res) => {
    console.log(req.userToken.id);
    let vehiclesData = await VehiclesModel.find({user_id:req.userToken.id})
    res.json(vehiclesData)

})

//  localhost:3000/vehicles/vehiclespost--> to Add another vehicles
router.post("/vehiclespost",auth, async (req, res) => {
    let validBody = validateVehicles(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    let token=req.userToken.id;
    console.log(token);
    let vehiclesData = new VehiclesModel(req.body);
    vehiclesData.user_id=token;
    await vehiclesData.save();
    res.status(201).json(vehiclesData);
})

//  localhost:3000/vehicles/:idEdit
router.put("/:idEdit",auth, async (req, res) => {
    let id = req.params.idEdit
    let validBody = validateVehicles(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let token=req.userToken.id;
        console.log(token);
        let updateData = await VehiclesModel.updateOne({ id: id,user_id:token }, req.body)
        res.status(200).json(updateData);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

})

//  localhost:3000/vehicles/:iddel
router.delete("/:iddel",auth, async (req, res) => {
    let id = req.params.iddel
    try {
        let token=req.userToken.id;
        let deleteData = await VehiclesModel.deleteOne({ id: id,user_id:token })
        res.status(200).json(deleteData);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

})

//  localhost:3000/vehicles/searchMyInfo/?s=  
router.get("/searchMyInfo",auth, async (req, res) => {

    try {
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || "_id";
        let reverse= (req.query.r=="yes")?req.query.r= -1:1
        let searchQ = req.query.s
        let query
        if (!searchQ) {
            query = {}
        }
        let searchRegExp = new RegExp(searchQ, "i")
        query = searchRegExp
        let token=req.userToken.id;
        let serchData = await VehiclesModel.find({ $or: [{ name: searchRegExp,user_id:token  }, { info: searchRegExp,user_id:token  }] })
        .limit(Number(perPage))
        .skip((page-1)*perPage)
        .sort({[sort]:reverse})
        res.status(200).json(serchData);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

})

//  localhost:3000/vehicles/search/?s=
router.get("/search", async (req, res) => {

    try {
        let searchQ = req.query.s
        let query
        if (!searchQ) {
            query = {}
        }
        let searchRegExp = new RegExp(searchQ, "i")
        query = searchRegExp
        // let token=req.userToken.id;
        let serchData = await VehiclesModel.find({ $or: [{ name: searchRegExp  }, { info: searchRegExp  }] })
        
        res.status(200).json(serchData);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

})
//localhost:3000/vehicles/cat/:catname
//?search=
//?perPage=how many items per page
//?page=num of page
//?sort=sorting by one of the attributs
router.get("/cat/:catname", async (req, res) => {

    try {
        let perPage = req.query.perPage || 5;
        let page = req.query.page || 1;
        let sort = req.query.sort || "_id";
        let searchQ = req.params.catname
        let reverse= (req.query.r=="yes")?req.query.r= -1:1
        let searchRegExp = new RegExp(searchQ, "i")
        let serchData = await VehiclesModel.find({ category: searchRegExp })
        .limit(Number(perPage))
        .skip((page-1)*perPage)
        .sort({[sort]:reverse})
        res.status(200).json(serchData);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

})

module.exports = router;

