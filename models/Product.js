import mongoose from "mongoose";

const BittingScama = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    bitting_price: {
      type: Number,
      require: true,
    },
    message: { type: String, required: false },
    delivery_adress: { type: String, required: true },
    is_bit_accepted: { type: Boolean, required: true, default: false },

  },
  {
    timestamps: true,
  }
);

const productsSchema = mongoose.Schema(
  {

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    title: {
      type: String,
      require: true,
    },
    sold: {

      type: Boolean,
      require: true,

      default: false


    },
    details: {
      type: String,
      require: true,
    },
    district: {
      type: String,
      require: true,
    },

    tags: [String],
    photo: [String],

    order_weight: {
      type: Number,
      required: true,
    },



    min_price: {
      type: Number,
      required: true,
    },
    max_price: {
      type: Number,
      require: true,

    },
    pd_uploaded_by: {
      require: true,
      type: String,
      enum: ["buyer", "seller"],
      default: "seller"


    },
    pd_bitting: [BittingScama],
    total_bit: {
      type: Number,
      required: true,
      default: 0
    }

  },
  { timestamps: true }
);

export default mongoose.model("products", productsSchema);
