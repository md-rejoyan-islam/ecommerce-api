import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { createError } from "../utils/createError.js";
import userModel from "../models/user.model.js";

const tokenVerify = asyncHandler(async (req, res, next) => {

  // auth  header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // cookie token
  const authToken = req.cookies.accessToken;

  const token = authHeader?.split(" ")[1] || authToken;

  // token  check
  if (!authToken) {
    throw createError(401, "Unauthorized, No token");
  }

  // token verify
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decode) => {
    if (err) {
      return res.status(400).json({
        message: "Unauthorized, Invalid token",
      });
    }
    const me = await userModel.findOne({ email: decode.email });

    req.me = me;
    next();
  });
});

export default tokenVerify;
