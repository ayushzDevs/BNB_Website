import mongoose from "mongoose";

async function dropDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mydb");

    await mongoose.connection.dropDatabase();

    console.log("Database dropped successfully");

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

dropDB();   