const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
    console.log("connection succesful");
})
.catch(err => console.log(err));
const initDB = async () => {
    await Listing.deleteMany({});        // delete all existing listings
    initData.data=initData.data.map((obj)=>({...obj,owner:"68e253d8f1a9e99ff111ac4d"}));
    await Listing.insertMany(initData.data); // insert sample listings
    console.log("data was initialized");
}
initDB();

































// 2️⃣ .map(...)
// 👉 .map() হচ্ছে JavaScript-এর array method।
// এটা array-এর প্রতিটি element (এখানে প্রতিটি listing object) নিয়ে একটা করে কাজ করে,
// তারপর নতুন একটা array তৈরি করে রিটার্ন করে।

// অর্থাৎ initData.data-এর প্রতিটি object-এ map() কাজ করবে।

// 3️⃣ (obj) => (...)
// 👉 এখানে obj হচ্ছে সেই একেকটা listing object।
// যেমন প্রথমবার চললে
// obj = { title: "Goa Beach", price: 2000 }

// 4️⃣ { ...obj, owner: "68e253d8f1a9e99ff111ac4d" }
// 👉 এই অংশটা object spread syntax ব্যবহার করছে।

// ...obj মানে — আগের object-এর সব property রেখে দাও।
// যেমন title, price ইত্যাদি।

// owner: "68e253d8f1a9e99ff111ac4d" মানে — নতুন একটা property যোগ করো
// যার key owner, value হচ্ছে "68e253d8f1a9e99ff111ac4d"।

// তাহলে নতুন object হবে:

// { title: "Goa Beach", price: 2000, owner: "68e253d8f1a9e99ff111ac4d" }


// 5️⃣ পুরো .map() একসাথে করলে
// 👉 প্রতিটি পুরনো object কে পরিবর্তন করে নতুন array বানাবে
// যেখানে প্রত্যেকটা object-এ owner ফিল্ড থাকবে।