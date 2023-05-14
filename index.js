import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/auth.js";

import districtRoute from "./routes/district.js";
import fileUploadRoute from "./routes/fileUpload.js";

import productsRoute from "./routes/product.js";
import usersRoute from "./routes/users.js";
import deliveryRoute from "./routes/delivery.js";
import orderRoute from "./routes/order.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const app = express();
dotenv.config();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const connect = async () => {
  mongoose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DATABASE Connection Successful");
    })
    .catch((err) => {
      console.log("ERROR..! Database Connection Faild", err);
    });
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);

app.use("/api", fileUploadRoute);
app.use("/api/districts", districtRoute);
app.use("/api/product", productsRoute);
app.use("/api/delivery", deliveryRoute);
app.use("/api/order", orderRoute);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
