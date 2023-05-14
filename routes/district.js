import express from "express";
import { getDistricts, getDistrictsById, postDistricts, updateDistricts } from "../controllers/districts.js";

const router = express.Router();



router.get("/", getDistricts);
router.get("/:id", getDistrictsById);
router.post("/", postDistricts);
router.put("/:id", updateDistricts);


export default router;
