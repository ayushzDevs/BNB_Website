const mongoose = require('mongoose');
const {Schema} = mongoose;


main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/post");
};


const userSchema = new Schema({
    username : String,
    email: String,
});

const postSchema = new Schema({
    content: String,
    likes : Number,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});


const user = mongoose.model("user", userSchema);
const post = mongoose.model("post", postSchema);


// const addData = async()=>{
//     let user1 = new user({
//         username: "user1",
//         email: "aaa@bbb.com"
//     })

//     let user2 = new user({
//         username: "user2",
//         email: "ccc@ddd.com"
//     });

//     let post9 = new post({
//         content: "This is the fourth post",
//         likes: 100,
//         user: user1._id,
//     });
//     await user1.save();
//     await post9.save();
//     console.log("Data added successfully");
// }

// addData();


const getpost = async()=>{
    let res = await post.find({}).populate("user","username");
    console.log(res);
};

getpost();