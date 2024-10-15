const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data")


async function main()
{
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

main()
.then((res)=>{
    console.log("Connected succesfully");
})
.catch(err=>{
    console.log(err);
})


const InitDB =async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'66f195e2cb1cd46b8b78a247'}));
    await Listing.insertMany(initData.data);
    console.log("Database was intialized with some values");
}

InitDB()