const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
// const { listingSchema } = require("../schema.js");
// const ExpressError = require('../utils/ExpressError.js');
const { isLoggedIn, isOwner, validateListing } = require("../middileware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage});//multer will save the file on our cloudinary storage
// const upload = multer({ dest: 'uploads/' });
// validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   }
//   else {
//     next();
//   }
// };
router.
  route("/")
  .get( wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
  
  // .post(upload.single('listing[image]'),(req,res)=>{
  //   res.send(req.file);//multer parsing the field data

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/search", isLoggedIn, wrapAsync(async (req, res, next) => {
  const { city } = req.query;

  console.log("User searched for location:", city);

  const listings = await Listing.find({ $or: [
    { location: new RegExp(city, "i") },
    { country: new RegExp(city, "i") }
  ] });

  console.log("Matched listings:", listings);

  res.render("listings/search.ejs", { listings, city });
}));


//show route , Update Route , Delete Route
router.
  route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
module.exports = router;



















// router.get("/", wrapAsync(listingController.index));
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.newListing));









//create route
// router.post("/listings", async (req,res,next) => {
//   // let{title,description,image,price,country,location}=req.body;(another simple way)
//   try{
//   let listing = req.body.listing;
//   const newListing = new Listing(listing);
//   await newListing.save();
//   res.redirect("/listings");
//   }catch(err){
//     next(err);
//   }
// });
// if(!req.body.listing){
//  throw new ExpressError(400,"Send valid data for listing")
// }
//   if (!req.body.listing.price) {
//   throw new ExpressError(400, "Price is required");
// }
// if (!req.body.listing.country) {
//   throw new ExpressError(400, "Country is required");
// }
// if (!req.body.listing.location) {
//   throw new ExpressError(400, "Location is required");
// }
//another way
// let result=listingSchema.validate(req.body);
// console.log(result);
// if(result.error){
//   throw new ExpressError(400,result.error);
// }