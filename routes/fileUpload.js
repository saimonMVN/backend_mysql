import express from "express";
import { handelFileUpload } from "../controllers/fileUploads.js";
import upload from "../middlewares/Multer.js";

const router = express.Router();

router.post("/file", upload.array("photos", 6), handelFileUpload);

export default router;
