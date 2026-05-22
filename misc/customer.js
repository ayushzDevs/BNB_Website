const mongoose = require('mongoose');
const {Schema} = mongoose;


main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/one_to_many");
    await findusr();
};


const orderSchema = new Schema({
    item : String,
    price: Number,
});



const order = mongoose.model("order",orderSchema);

// const findorders = async()=>{
//     let res = await order.insertMany(
//         [
//             {
//                 item: "item1",
//                 price: 100,
//             },
//             {
//                 item: "item2",
//                 price: 200,
//             },
//              {
//                 item: "item3",
//                 price: 300,
//             },
//         ]
//     );
//     console.log(res);
// }

// findorders();

const customer_schema = new Schema({
    name : String,
    orders : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    }]
});

const customer = mongoose.model("customer",customer_schema);

const findcustomer = async()=>{
    let cust1 = await customer.find({}).populate("orders");
    console.log(cust1[0]);
};

findcustomer();