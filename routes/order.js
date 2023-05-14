import express from "express";
import { getAllOrder, updateOrderStatus } from "../controllers/order.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getAllOrder);

router.get("/:id", updateOrderStatus);



export default router;
