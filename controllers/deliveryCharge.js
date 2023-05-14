import mongoose from "mongoose";
import { createError } from "../middlewares/error.js";
import DeliveryCharge from "../models/DeliveryCharge.js";

export const getDeliveryCharge = async (req, res, next) => {

  try {

    const data = await DeliveryCharge.find({})

    res.status(201).json({
      success: true,
      message: "success ",
      result: data,
    });

  } catch (error) {

    next(error);



  }

};



export const createDelioveryCharge = async (req, res, next) => {
  const { amount } = req.body;



  const charge = new DeliveryCharge({ amount: amount });

  try {
    await charge.save();
    res.status(201).json({
      success: true,
      message: "successfully create",
      result: charge,
    });
  } catch (error) {
    next(error);
  }
};
export const updateDeliveryCharge = async (req, res, next) => {
  const { amount } = req.body;



  try {


    const data = await DeliveryCharge.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { amount } },
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

