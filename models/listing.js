const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type : String,
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
        default : "https://share.google/lha192KfayzqD0irI",
        set:(v)=>v ===""? "https://share.google/lha192KfayzqD0irI" :v,

    },
    country : {
        type : String
    }

});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;