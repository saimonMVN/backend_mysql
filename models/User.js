import JWT from "jsonwebtoken";
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "seller",
    },
  },
  { timestamps: true },
);

UserSchema.methods.generateJWT = function () {
  const token = JWT.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      isAdmin: this.isAdmin,
      img: this.img,
      city: this.city,
      address: this.address,
    },
    process.env.JWT,
    // { expiresIn: "27d" }
  );
  return token;
};

export default mongoose.model("User", UserSchema);
