import mongoose from "mongoose";
import { createError } from "../middlewares/error.js";
import Products from "../models/Product.js";
import DeliveryCharge from "../models//DeliveryCharge.js";
import Order from "../models/Order.js";


export const getProducts = async (req, res, next) => {
  const { searchQuery, district, page, pd_uploaded_by, sold = false } = req.query;

  const queary = {};
  queary.sold = sold
  if (searchQuery?.length > 2) {
    queary.title = new RegExp(searchQuery, "i");
  }
  if (district && district.length > 2) {
    queary.district = new RegExp(district, "i");
  }


  if (pd_uploaded_by == "buyer" || pd_uploaded_by === "seller") {
    queary.pd_uploaded_by = pd_uploaded_by;

  }



  try {
    const LIMIT = 40;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await Products.countDocuments({});
    const products = await Products.find(queary)
      .populate([
        { path: "pd_bitting.user", select: "img name  city  role email phone address" },
        { path: "user_id", select: "img name  city  role email phone address" },
      ])
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: products,
      success: true,
      currentPage: Number(page ? page : 1),
      numberOfPages: Math.ceil(total / LIMIT),
      total: total,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  let { id } = req.params;

  try {
    const product = await Products.findById({ _id: id }).populate([
      { path: "pd_bitting.user", select: "img name  city  role email phone address" },
      { path: "user_id", select: "img name  city  role email phone address" },
    ]);

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
export const getProductByUserId = async (req, res, next) => {
  let { id } = req.params;

  try {
    const product = await Products.find({ user_id: id }).populate([
      { path: "pd_bitting.user", select: "img name  city  role email phone address" },
      { path: "user_id", select: "img name  city  role email phone address" },
    ]);

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const product = req.body;
  const { _id, role } = req.user


  console.log(req.body)

  const newProducts = new Products({ user_id: _id, pd_uploaded_by: role, ...product });

  try {
    await newProducts.save();

    res.status(201).json({
      success: true,
      message: "successfully create",
      result: newProducts,
    });
  } catch (error) {
    next(error);
  }
};

// export const updateProduct= async (req, res, next) => {
//   const { id } = req.params;

//   const { title, details, photo, district, tags } = req.body;

//   try {
//     const data = await Products.findByIdAndUpdate(
//       { _id: id },
//       { title, details, photo, district, tags },
//       { new: true }
//     );

//     res.json({ success: true, message: "successfully create", result: data });
//   } catch (error) {
//     next(err);
//   }
// };

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);

  try {
    await Products.findByIdAndRemove({ _id: id });

    res.status(200).json({ success: true, message: "product deleted successfully." });
  } catch (error) {
    next(err);
  }
};

export const createBitting = async (req, res, next) => {
  const { message, bitting_price, delivery_adress } = req.body;

  try {
    const product = await Products.findById({ _id: req.params.id });

    if (product) {
      const alreadyBitted = product.pd_bitting.find((r) => r.user.toString() === req.user._id.toString());
      if (alreadyBitted) {
        return next(createError(409, " already Bitted"));
      }
      try {
        const bitInfo = {
          bitting_price: bitting_price,
          message,
          delivery_adress,
          user: req.user._id,
        };
        product.pd_bitting.push(bitInfo);
        product.total_bit = product.pd_bitting.length;
        await product.save();
        res.status(201).json({ message: "bit  success", success: true });
      } catch (error) {
        return next(error);
      }
    } else {
      return next(createError(404, "product not found"));
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const acceptBit = async (req, res, next) => {
  const { bit_id } = req.body;
  try {
    const product = await Products.findById({ _id: req.params.id });


    if (product) {
      const alreadySold = product.pd_bitting.find((x) => x.is_bit_accepted === true);
      if (alreadySold) {
        return next(createError(409, " already sold"));
      } else if (!product.user_id.equals(req.user._id)) {
        return next(createError(403, "You are not authorized for this action "));
      }

      const acceptedBit = product.pd_bitting.find((x) => x._id.equals(bit_id));



      if (!acceptedBit) {
        return next(createError(404, "Not found"));
      }




      const index = product.pd_bitting.findIndex((x) => x._id === bit_id);

      (acceptedBit.is_bit_accepted = true), product.pd_bitting.splice(index, 1, acceptedBit);
      product.sold = true

      try {

        const deliveryCharge = await DeliveryCharge.find({})
        console.log(deliveryCharge)

        const orderData = {
          product: product._id,
          seller: product.user_id,
          buyer: acceptedBit.user,
          price: acceptedBit.bitting_price,
          delivery_adress: acceptedBit.delivery_adress,
          deliveryCharge: deliveryCharge[0].amount,

        }



        try {
          const newOrder = new Order({ ...orderData })
          await newOrder.save()
          try {
            await product.save();
            res.status(201).json({ message: "bit  success accepted", success: true });

          } catch (error) {

            return next(error);


          }

        } catch (error) {



          return next(error);

        }



      } catch (error) {
        return next(error);
      }
    } else {
      return next(createError(404, "product not found"));
    }
  } catch (error) {
    next(error);
  }
};
