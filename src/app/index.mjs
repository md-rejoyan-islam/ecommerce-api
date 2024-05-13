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
import seedRouter from "../v1/routes/seeds.routes.mjs";
import { successResponse } from "../v1/services/responseHandler.mjs";
import v1 from "./v1.mjs";
import v2 from "./v2.mjs";

// express app
const app = express();

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// cookie parser
app.use(cookieParser());

// static folder
app.use("/public", express.static(path.resolve("public")));

// seeds routes
app.use("/api/v1/seeds", seedRouter);

// version 1 routes
v1.forEach((router) => {
  app.use(router.path, router.route);
});

// version 2 routes
v2.forEach((router) => {
  app.use(router.path, router.route);
});

/**
 * @description   : Home route
 * @access        : Public
 * @method        : GET
 */

app.get(
  "/",
  asyncHandler(async (_, res) => {
    successResponse(res, {
      statusCode: 200,
      message: "Api is running successfully.",
    });
  })
);

// client error handling
app.use(
  asyncHandler(async () => {
    throw createError.NotFound("Could not find this route.");
  })
);

//server error handling
app.use(errorHandler);

// export default
export default app;
