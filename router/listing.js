const express = require("express");
let router = express.Router();

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
// console.log(storage);
const {upload} = require("../cloudConfig.js")

let mongoose = require("mongoose");
let path = require("path");
let Listing = require("../models/listing.js");
// let Review = require("../models/review.js");
// let Data = ("../init/data.js");
var methodOverride = require("method-override");
let ejsMate = require("ejs-mate");
let asyncWrap = require("../utils/AsyncWrap.js") ;
let ExpressError = require("../utils/ExpressError.js") ;
let {ListingSchema,ReviewSchema} = require("../Schema.js");
const { isloggedIn, isOwner ,ValidateError} = require("../middleware.js");

router.use(express.urlencoded({ extended: true }));

const listingControlers = require("../controllers/listing.js")
// const  = require("../middleware.js");

// index route

router.route("/")
.get( asyncWrap(listingControlers.index))
.post(
  isloggedIn,
  upload.single("image"),
  ValidateError,
  asyncWrap(listingControlers.newListing),
  
  
  
);


  
  router.get("/new",isloggedIn, (req, res) => {
    console.log(req.user);  
    
    res.render("listing/new");
  });
  

router.route("/:id")
.get( asyncWrap(listingControlers.showListing))
.put( isloggedIn,isOwner, upload.single("image"),ValidateError,asyncWrap(listingControlers.updateListing))
.delete(isloggedIn,isOwner, listingControlers.destroyListing);
  

  //edit route
  router.get("/:id/edit",isOwner, isloggedIn,asyncWrap(listingControlers.renderEditForm));
  
  
  module.exports = router;