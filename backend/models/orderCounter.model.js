import mongoose from "mongoose";
const couterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 0 },
  yearMonth: { type: String },
});

const OrderCounter = mongoose.model("OrderCounter", couterSchema);
export default OrderCounter;
