const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  posted_by: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Review", reviewSchema);

