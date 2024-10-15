const express = require("express");
let router = express.Router({mergeParams:true});
const User = require("../models/user");
const asyncWrap = require("../utils/AsyncWrap");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const { signup, renderLoginForm } = require("../controllers/user");
router.use(express.urlencoded({ extended: true }));

userController = require("../controllers/user");
const listingControlers = require("../controllers/listing.js")

router.route("/")
.get(listingControlers.index);

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);


router.route("/signup")
.get(async (req,res)=>{
    res.render("user/signup.ejs");
})
.post(asyncWrap(userController.signup));

router.get("/logout",userController.logout)

module.exports = router;