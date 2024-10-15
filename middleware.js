const { session } = require("passport");
const Listing = require("./models/listing") 
let ExpressError = require("./utils/ExpressError.js") ;
const {ReviewSchema,ListingSchema} = require("./Schema.js");
const Review = require("./models/review.js");

module.exports.isloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
        {
          console.log(req.originalUrl);
          req.session.redirectUrl = req.originalUrl;
          console.log(req.path);
          req.flash("error",`You must be logged in to modify listing`);
          return res.redirect("/login");
        }
        next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl)
  {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner =async (req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(res.locals.currUser&&!listing.owner.equals(res.locals.currUser._id))
  {
      req.flash("error","You dont have permission to edit");
      return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewAuthor =async (req,res,next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id))
  {
      req.flash("error","You are not the author of the review ");
      return res.redirect(`/listings/${id}`);
  }
  next();
}



module.exports.ValidateReview  = (req,res,next)=>{ 
  console.log(ReviewSchema.validate(req.body));
  
  let {error} = ReviewSchema.validate(req.body);
  if(error)
  {
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
    
  else next();
}

module.exports.ValidateError  = (req,res,next)=>{
  
  let {error} = ListingSchema.validate(req.body);
  if(error)
  {
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg+1+"GHVHGVHGVHGCCGFCG");
  }

  else next();
}

