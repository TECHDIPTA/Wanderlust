if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}
// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require('./utils/ExpressError.js');
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const dbUrl=process.env.ATLASDB_URL;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
main().then(() => {
  console.log("connection succesful");
})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
  secret: process.env.SECRET,
  },
  touchAfter:24*60*60,
});
store.on("error",()=>{
  console.log("Error in MONGO SESSION STORE",err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge:Date.now()+7*24*60*60*1000,
    httpOnly:true,
  }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//for each req passport get initialized
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  // console.log(res.locals.success);
  res.locals.currUser=req.user;
  next();
})

// app.get("/demouser",async(req,res)=>{
// let fakeUser=new User({
//   email:"pradiptadhar6@getMaxListeners.com",
//   username:"Pradipta Dhar"
// });
// let registeredUser=await User.register(fakeUser,"PRad26@#");
// res.send(registeredUser);
// });


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
// res.send("something went wrong");
let {statusCode=500,message="something went wrong"}=err;
// res.status(statusCode).send(message);
res.status(statusCode).render("error.ejs",{message});
})
app.listen(8080, () => {
  console.log("server is running on port 8080");
});



































// app.get("/testListing",async(req,res)=>{
// let sampleListing=new Listing({
//     title:"My new villa",
//     description:"By the beach",
//     price:1200,
//     location:"Digha,WestBengal",
//     country:"India",
// });
//  await sampleListing.save();
//  console.log("sample was saved");
//  res.send("successful testing");
// });