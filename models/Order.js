import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "products",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    deliveryCharge: {
      type: Number,
      required: true,

    },
    price: {
      type: Number,
      required: true,
    },
    delivery_adress: {

      type: String,
      required: true,


    },

    status: {
      require: true,
      type: String,
      enum: ["pending", "confirm", "receive", "ongoing", "delivered"],
      default: "pending",


    },


  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
