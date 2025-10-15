const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { coordinates } = require("@maptiler/client");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,

    },
    location: {
        type: String,

    },
    country: {
        type: String,
    },
    reviews: [{
        type: Schema.Types.ObjectId,//one to many
        ref: "Review",
    },],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    //     coordinates:{
    // type:[Number],
    // required:true;
    // }
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
},
// category{
//     type:String,
//     enum:["mountains","arctic","farms","deserts"],
// }
});
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;















// image: {
//         filename: {
//             type: String,
//             default: "listingimage"
//         },
//         url: {
//             type: String,
//             default: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60"

//         }
//     },