const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type : String,
        default : "Untitled Listing",
        required : true
    },
    description:{
        type : String
    },
    price:{
        type : Number
    },
    location:{
        type : String
    },
    image:{
        type : String,
        default : "https://share.google/cGWvWkBLSyy7vbuEF",
        set:(v)=>v ===""? "https://share.google/cGWvWkBLSyy7vbuEF" :v,

    },
    country : {
        type : String
    }

});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;