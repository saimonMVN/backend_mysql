import express from "express";
import {
  getDeliveryCharge,
  createDelioveryCharge,
  updateDeliveryCharge
} from "../controllers/deliveryCharge.js";
import { verifyUser } from "../middlewares/verifyToken.js";

const router = express.Router();

// Create


router.post("/", createDelioveryCharge)
router.get("/", getDeliveryCharge)
router.put("/:id", updateDeliveryCharge);

//UPDATE
// router.put("/:id", verifyUser, updateUser);

// //DELETE
// router.delete("/:id", verifyUser, deleteUser);

// //GET
// router.get("/:id", getUser);

// //GET ALL
// router.get("/", getUsers);

export default router;
