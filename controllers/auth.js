import bcrypt from "bcryptjs";
import { createError } from "../middlewares/error.js";
import User from "../models/User.js";

export const register = async (req, res, next) => {
  const { name, role, email, isAdmin, phone, password } = req.body;


  if (!name || !email || !password) {
    return res.status(203).json({ message: "Fill all Fields" });
  } else {
    try {
      let isExist = await User.findOne({ email: email });
      console.log(isExist)

      if (isExist) {
        return res
          .status(203)
          .json({ message: "User Already Exist", result: false });
      } else {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
          ...req.body,
          password: hash,
        });


        const Token = await newUser.generateJWT();

        const response = await newUser.save();
        const { password, isAdmin, ...otherDetails } = response._doc

        res.status(200).json({
          data: { details: { ...otherDetails }, isAdmin, token: Token },
        });
      }
    } catch (err) {

 
      next(err);
    }
  }
};
export const login = async (req, res, next) => {

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const Token = await user.generateJWT();

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .status(200)
      .json({ data: { details: { ...otherDetails }, isAdmin, token: Token } });
  } catch (err) {
    next(err);
  }
};
