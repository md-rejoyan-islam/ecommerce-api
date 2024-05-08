import asyncHandler from "express-async-handler";

import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { createError } from "../utils/createError.js";
import userModel from "../models/user.model.js";

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createError(400, "Please provide email and password");
  }

  // check if user exist
  const loginUser = await userModel.findOne({ email });

  if (!loginUser) {
    res.status(400);
    throw new Error("User not found");
  }

  // check if password match
  const isMatch = bcrypt.compareSync(password, loginUser.password);
  if (!isMatch) {
    throw createError(400, "Invalid password");
  }

  // access token
  const accessToken = jwt.sign(
    { email, role: loginUser.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );

  // refresh token
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: false, // only https
  });

  res.status(200).json({
    accessToken,
  });
});

// refresh token request

export const refreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies.refreshToken) {
    throw createError(401, "Invalid request");
  }

  jwt.verify(
    cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, { email }) => {
      if (err) {
        throw createError(401, "Invalid token");
      }
      const tokenUser = await userModel.findOne({
        email,
      });

      if (!tokenUser) {
        res.status(401);
        throw new Error("token user not found");
      }
      // access token
      const accessToken = jwt.sign(
        { email, role: tokenUser.role },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
      );

      res.status(200).json({
        accessToken,
      });
    })
  );
};

// logout request

export const logout = (req, res) => {
  const cookies = req.cookies;

  // if already logout
  if (!cookies?.refreshToken) {
    throw createError(401, "Invalid request");
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
  });
  res.status(200).json({
    Message: "Logout Successfully",
  });
};
