import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import cookieParser from "cookie-parser";
import asyncHandler from "express-async-handler";
import createError from "http-errors";

//import routes
import productCategoryRoute from "../v1/routes/category.routes.js";
import productBrandRoute from "../v1/routes/brand.routes.js";
import productTagRoute from "../v1/routes/tag.routes.js";
import productRoute from "../v1/routes/product.routes.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import corsOptions from "../config/corsSetup.js";
import userRouter from "../v1/routes/users.routes.js";
import authRouter from "../v1/routes/auth.routes.js";
import seedRouter from "../v1/routes/seeds.routes.js";
import { successResponse } from "../v1/services/responseHandler.js";

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
app.use("/api/public", express.static("api/public"));

// seeds routes
app.use("/api/v1/seeds", seedRouter);

/**
 * @description: for version 1
 */

// // product  route
// app.use("/api/v1/product", productRoute);

// // product category route
// app.use("/api/v1/category", productCategoryRoute);

// // product brand route
// app.use("/api/v1/brand", productBrandRoute);

// // product tag route
// app.use("/api/v1/tag", productTagRoute);

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
