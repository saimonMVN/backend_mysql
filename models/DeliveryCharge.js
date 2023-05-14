import mongoose from "mongoose";
const DeliveryChargeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryCharge", DeliveryChargeSchema);
