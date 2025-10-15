const maptilerClient = require("@maptiler/client");
const Listing=require("../models/listing");

maptilerClient.config.fetch = fetch;
const mapToken=process.env.MAP_TOKEN;
maptilerClient.config.apiKey = mapToken;
module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm=async (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{
    path:"author",},
  }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs",{listing});
};
module.exports.createListing=async (req, res, next) => {
  
  let listing = req.body.listing;
  // in an async function, or as a 'thenable':
const result = await maptilerClient.geocoding.forward(req.body.listing.location, {
  limit: 1,
});
// console.log(result.features[0].geometry);
// res.send("done!");

//   // console.log(req.user);
//   if(!listing.image || !listing.image.url) {
//     listing.image = undefined;
// }
let url=req.file.path;
let filename=req.file.filename;
console.log(url,"..",filename);
  const newListing = new Listing(listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  console.log(result.features[0].geometry.coordinates);
  newListing.geometry=result.features[0].geometry;
  let savedListing=await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
module.exports.renderEditForm=async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing")
  //}
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
 originalImageUrl =originalImageUrl.replace("upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing ,originalImageUrl});
};

module.exports.updateListing=async (req, res) => {
  let { id } = req.params;
  //   let listing = await Listing.findById(id);
  // if(!listing.owner.equals(res.locals.currUser._id)){
  //   req.flash("error","You dont have permission to edit");
  //   return res.redirect(`/listings/${id}`);
  // }
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file!="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}