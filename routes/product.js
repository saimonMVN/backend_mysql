import express from "express";
import { getProducts, getProductByUserId, getProductById, createProduct, deleteProduct, createBitting, acceptBit } from "../controllers/products.js";
import { verifyAdmin, verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);
router.get("/user/:id", getProductByUserId);

//CREATE
router.post("/", verifyToken, createProduct);

// router.put("/:id", verifyToken, updatePost);
router.put("/bitting/:id", verifyToken, createBitting);
router.put("/bitting/accept/:id", verifyToken, acceptBit);
//DELETE
router.delete("/:id", verifyToken, deleteProduct);
// router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);

export default router;
