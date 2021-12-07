const express = require("express");
const bcrypt=require("bcrypt")
const { validateUser, UserModel, genToken, validatelogin } = require("../models/userModel");
const { auth } = require("../middele/auth");

const router = express.Router();
//  https://project-benor-2021.herokuapp.com/users/register
router.post("/register", async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.pass= await bcrypt.hash(req.body.pass,10)
    await user.save();
    user.pass = "*****"
    res.json(user)
  } catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already in system , try login" })
    }
    console.log(err);
    res.status(500).json({ msg: "Something Worng , come back later" })
  }
})
// localhost:3000/users/login
router.post("/login", async (req, res) => {
  let validBody = validatelogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({email: req.body.email})
    if (!user) {
      return res.status(401).json({ msg: "Email or Password Worng " })
    }
    let pass = await bcrypt.compare(req.body.pass,user.pass)
    if (!pass) {
      return res.status(401).json({ msg: "Email or Password Worng" })
    }
     let newToken = genToken(user._id);
     res.json({ token: newToken })
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something Worng , come back later" })
  }

})
// localhost:3000/users/myinfo
router.get("/myinfo",auth ,async (req, res) => {
  console.log(req.userToken.id);
  let data = await UserModel.findOne({_id:req.userToken.id},{pass:0})
  res.json(data)
})



module.exports = router;