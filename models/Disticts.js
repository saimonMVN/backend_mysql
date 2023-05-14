import mongoose from "mongoose";
const DistrictSchema = new mongoose.Schema({


  _id: { type: String },
  district: {
    type: String,
    required: true,
  },
  districtbn: {
    required: false,
    type: String,
  },
  coordinates: {
    required: false,
    type: String,
  },
  details: {
    type: String,
    required: false,
  },
  photo: String



});

export default mongoose.model("District", DistrictSchema)