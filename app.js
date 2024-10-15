let express = require("express");
let app = express();
let mongoose = require("mongoose");
let path = require("path");

if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}


// let router = express.Router({mergeParams:true});

// let Listing = require("./models/listing.js");
// let Review = require("./models/review.js");
// let Data = ("../init/data.js");
var methodOverride = require("method-override");
let ejsMate = require("ejs-mate");
let asyncWrap = require("./utils/AsyncWrap.js") ;
let ExpressError = require("./utils/ExpressError.js") ;
let session = require("express-session");
const MongoStore = require('connect-mongo');
let flash = require("connect-flash");
let passport =  require("passport");
let LocalStrategy = require("passport-local");
// let isloggedIn = require("./middleware.js")
let User = require("./models/user.js");
// let {ListingSchema,ReviewSchema} = require("./Schema.js");


let dbUrl = "mongodb+srv://mohammad123456rizwan:PeYrhMtoTrhjw4ls@cluster0.hjd7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let mongoUrl = "mongodb://localhost:27017/wanderlust"
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then((res) => {
    console.log("Connected succesfully");
  })
  .catch((err) => {
    console.log(err);
  });



app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600
})

store.on("error",()=>{
  console.log("Error in mongo session store");
})

app.use(session({
  store,
  secret:process.env.SECRET,
  saveUninitialized:true,
  resave:false,
  cookie:{
    _expires:Date.now() + 1000 * 60 * 24 * 7,
    originalMaxAge:1000 * 60 * 24 * 7,
    httpOnly:true
  }
},
))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})
// let ExpressError = require("./ExpressError.js");

let listingRouter = require("./router/listing.js");
let reviewRouter = require("./router/review.js");
let userRouter = require("./router/user.js");

app.use(flash());


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"Raj fort",
//         description:"This is a independent villa",
//         image:"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price:5000,
//         location:"Calicut",
//         country:"India"
//     });
//     await sampleListing.save();
//     res.send("listing saved");
//     console.log(sampleListing);
// })








const handleValidationError = function(err){
  console.log("This is validation error");
  console.dir(err);
  return err;
}



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next)=>{
  if(err.name == "ValidationError"){
    err = handleValidationError(err);
  }
  next(err);
})

app.use((err,req,res,next)=>{
  let {status=500,message="This is an valid error"} =err;
  res.status(status).render("listing/error.ejs",{message});
})

