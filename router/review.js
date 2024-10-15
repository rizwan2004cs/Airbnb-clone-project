const express = require("express");
let router = express.Router({mergeParams:true});

let mongoose = require("mongoose");
let path = require("path");
let Listing = require("../models/listing.js");
let Review = require("../models/review.js");
// let Data = ("../init/data.js");
var methodOverride = require("method-override");
let ejsMate = require("ejs-mate");
let asyncWrap = require("../utils/AsyncWrap.js") ;
let ExpressError = require("../utils/ExpressError.js") ;
let {ListingSchema,ReviewSchema} = require("../Schema.js");
const { route } = require("./listing.js");
router.use(express.urlencoded({ extended: true }));

const {ValidateReview, isloggedIn,isReviewAuthor}  = require("../middleware.js")
const reviewController = require("../controllers/review.js")


  router.post("/",isloggedIn, ValidateReview,asyncWrap(reviewController.createReview));
  
  
  
  router.delete("/:reviewId",isloggedIn,isReviewAuthor,reviewController.destroyReview);
  
  
  module.exports = router;