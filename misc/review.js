const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    Username:String,
});

const User = mongoose.model("User", UserSchema);

const reviewSchema = new Schema({
    rating:Number,
    comment:[{body:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
}],
    posted_by :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

const Review = mongoose.model("Review", reviewSchema);

const add_review = async()=>{
    const newUser = new User({
        Username:"shohini",
    })

    const newreview = new Review({
        rating:4,
        comment: [{body:"I am chudail",}]
    })

    

    await newUser.save();
    await newreview.save();
}



async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/reviews");
    await add_review();
    await mongoose.connection.close();
}


main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

