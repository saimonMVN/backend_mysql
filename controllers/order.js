import mongoose from "mongoose";
import { createError } from "../middlewares/error.js";
import Order from "../models/Order.js";

export const getAllOrder = async (req, res, next) => {

  const { page } = req.query;

  let customQueary = {}

  if (req.user.role === "seller") {

    customQueary.seller = req.user._id
  }
  else if (req.user.role === "buyer") {

    customQueary.buyer = req.user._id
  } else if (req.user.role === "admin") {

    customQueary = {}

  }

  console.log(customQueary)

  try {
    const LIMIT = 30;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await Order.countDocuments({});
    const orders = await Order.find({ ...customQueary }).populate([
      { path: "product", select: "title  details  photo  min_price  max_price  pd_uploaded_by total_bit order_weight" },
      { path: "seller", select: "img name  city  role email phone address" },
      { path: "buyer", select: "img name  city  role email phone address" },
    ])
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: orders,
      success: true,
      currentPage: Number(page ? page : 1),
      numberOfPages: Math.ceil(total / LIMIT),
      total: total,
    });
  } catch (error) {
    next(error);
  }

};



export const updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    const data = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status } },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "successfully updated",
      result: data,
    });
  } catch (error) {
    next(error);
  }
};

