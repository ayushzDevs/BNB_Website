const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    addresses: [
        {
            location: String,
            city: String,
        },
    ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;

async function addusr(){
    const usr1 = new User({
        username: "ayush",
        email: "xxx@mail.com",
        password: "123456",
        addresses: [
            {
                location: "India",
                city: "Delhi",
            },
        ],
    });
    usr1.addresses.push({
        location: "India",
        city: "Mumbai"
    });
    const rs = await usr1.save();
    console.log("User added:", rs);
    console.log(usr1)
}

main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fuck");
    await addusr();
};
