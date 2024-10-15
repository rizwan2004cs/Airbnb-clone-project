const User = require("../models/user"); 

module.exports.signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
    const newUser = new User({email,username});
    let u = await User.register(newUser,password);
    console.log(u);
    req.login(u,(err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log(redirectUrl+".."+res.locals.redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            next(err);
        }
        req.flash("success","You are logged out now");
        res.redirect("/listings");
    });
}