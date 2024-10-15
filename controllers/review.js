const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const id = req.params.id;
    // let {review} = req.body;
    let listing = await Listing.findById(id);
    console.log("New review item"+listing);
    
    let newReview =  new Review(req.body.review);
    console.log(newReview);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    if(!newReview)
      throw new ExpressError(400,"No review given")
    await newReview.save();
    await listing.save();
    req.flash("success","Review Created");
    res.redirect(`/listings/${id}`)
    // res.send(`Review page undergoing for ${id}`)
  
  }

  module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} =req.params;
    // res.send(id+"     "+reviewId) 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
  }