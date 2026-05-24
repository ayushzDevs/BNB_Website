const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
    item: String,
    price: Number,
});

const customerSchema = new Schema({
    name: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
        },
    ],
});


customerSchema.pre("findOneAndDelete",async ()=>{
    console.log("Pre hook called before deleting a customer");
})

customerSchema.post("findOneAndDelete",async ()=>{
    console.log("Post hook called after deleting a customer");
})

const Order = mongoose.model("order", orderSchema);
const Customer = mongoose.model("customer", customerSchema);

const addCustomerWithOrder = async () => {
    const newCustomer = new Customer({
        name: "customer1",
    });

    const newOrder = new Order({
        item: "chicken",
        price: 500,
    });

    newCustomer.orders.push(newOrder);

    await newOrder.save();
    await newCustomer.save();
};

const delcust = async()=>{
    let data = await Customer.findOneAndDelete({name:"customer1"});
    console.log(data);
}

delcust();

const findCustomers = async () => {
    const customers = await Customer.find({}).populate("orders");
    console.log(customers);
};

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/ord");
    await addCustomerWithOrder();
    await findCustomers();
    await mongoose.connection.close();
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB:", err);
    });
