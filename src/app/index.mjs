import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import morgan from "morgan";

//import routes
import path from "path";
import corsOptions from "../config/corsSetup.mjs";
import { errorHandler } from "../middlewares/errorHandler.mjs";
import authRouter from "../v1/routes/auth.routes.mjs";
import brandRouter from "../v1/routes/brand.routes.mjs";
import categoryRouter from "../v1/routes/category.routes.mjs";
import seedRouter from "../v1/routes/seeds.routes.mjs";
import userRouter from "../v1/routes/users.routes.mjs";
import { successResponse } from "../v1/services/responseHandler.mjs";
import tagRouter from "../v1/routes/tag.routes.mjs";
import productRouter from "../v1/routes/product.routes.mjs";

// express app
const app = express();

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// cookie parser
app.use(cookieParser());

// static
app.use("/public", express.static(path.resolve("public")));

/**
 * @description: for version 1
 */
// seeds routes
app.use("/api/v1/seeds", seedRouter);

// // product  route
app.use("/api/v1/products", productRouter);

// product category route
app.use("/api/v1/categories", categoryRouter);

// // product brand route
app.use("/api/v1/brands", brandRouter);

// // product tag route
app.use("/api/v1/tags", tagRouter);

// auth route
app.use("/api/v1/auth", authRouter);

// user route
app.use("/api/v1/users", userRouter);

/**
 * @description: for version 2
 */

/**
 * @description   : Home route
 * @access        : Public
 * @method        : GET
 */

app.get(
  "/",
  asyncHandler(async (req, res) => {
    successResponse(res, {
      statusCode: 200,
      message: "Api is running successfully.",
    });
  })
);

// client error handling
app.use(
  asyncHandler(async (req, res) => {
    throw createError.NotFound("Could not find this route.");
  })
);

//server error handling
app.use(errorHandler);

// export default
export default app;
