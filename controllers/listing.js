const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: map_token });

module.exports.index = async (req, res,next) => {
    let lists = await Listing.find({}).populate("reviews").populate('owner',"username");
    if(lists.length === 0)
       {
        next(new ExpressError(404,"Data is not found"));
       }
    // console.log(req.flash("success"));
    res.render("listing/index.ejs", { lists: lists });
  }


  module.exports.showListing = async (req, res,next ) => {
  
    const { id } = req.params; // Use req.params.id directly
    const list = await Listing.findById(`${id}`).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); // Use a consistent name, e.g., list
    if(!list)
       {
        // next(new ExpressError(404,"Data is not found"));
        req.flash("error","Listing requested is not available")
        res.redirect("/listings");
       }
  
    res.render("listing/show", { list: list }); // Pass list as the key to the template
  
  }

  module.exports.newListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.location,
      limit: 1
    })
      .send();
    console.log(req.file)
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url+"_____"+filename);  

   let { title, description, image, price, country, location } = req.body;

   if(!req.body)
     throw new ExpressError(400,"Enter valid data")
   let newListing = Listing(req.body);
   newListing.owner = req.user._id;
   newListing.image = {url,filename};
   newListing.geometry = response.body.features[0].geometry;
   await newListing
     .save()
     .then((res) => {
      console.log(newListing);
       console.log("Saved Successfully");
     })
     .catch((err) => {
       console.log(err);
     });
   //   res.send(req.body);
   console.log(req.body);
   req.flash("success","New Listing added");
   res.redirect("/listings");  
 }



 module.exports.renderEditForm= async (req, res) => {
   const id = req.params.id;
   let listing = await Listing.findById(id);
   console.log(id);
   
   if(!listing)
     {
      // next(new ExpressError(404,"Data is not found"));
      req.flash("error","Listing requested is not available")
      res.redirect("/listings");
     } 
     else
     {
       req.flash("success","Listing updated");
     }
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload/","/upload/w_30/")
     console.log(originalImageUrl);
   res.render("listing/edit.ejs", { listing: listing ,originalImageUrl});
 }

 module.exports.updateListing = async (req, res) => {
   //    res.redirect("/listings")
       const id = req.params.id;
       let listing = await Listing.findByIdAndUpdate(id, req.body);
      if(typeof req.file  !== "undefined")
      {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
      }
       req.flash("success","Listing updated");
      
    
       res.redirect(`/listings/${id}`);
      
     }

module.exports.destroyListing = async (req, res) => {
   const id = req.params.id;
   let delList = await Listing.findByIdAndDelete(id)
     .then((res) => {
       console.log(res);
     })
     .catch((err) => {
       console.log(err);
     });
   console.log("deleted " + delList);
   req.flash("success","Listing deleted");
   res.redirect("/listings");
 }