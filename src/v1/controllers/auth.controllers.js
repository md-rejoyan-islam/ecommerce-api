import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import { createError } from "../utils/createError.js";
import createError from "http-errors";
import userModel from "../../models/user.model.js";
import hashPassword from "../../utils/hashPassword.js";
import findData from "../../v1/services/findData.js";
import { successResponse } from "../../v1/services/responseHandler.js";
import createJWT from "../../helper/createJWT.js";
import {
  jwtRegisterKeyExpire,
  jwtRegisterSecretKey,
  jwtVerifyKeyExpire,
  jwtVerifyKeySecret,
} from "../../app/secret.js";
import sendAccountVerifyMail from "../../utils/accountVerifyMail.js";

/**
 *
 * @apiDescription    User Register
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/register
 * @apiAccess         Public
 *
 * @apiSuccess        { success : true , message, date }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 * @apiError          ( Not Found 404 )   No Brand data found
 *
 */
export const userRegister = asyncHandler(async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw createError(400, "Please provide email and password");
  }

  const { email } = req.body;

  // check if user exist
  const user = await userModel.exists({ email: req.body.email });

  if (user) {
    throw createError(409, "Already have an account with this email.");
  }

  // create verify token
  const verifyToken = createJWT(
    { ...req.body },
    jwtRegisterSecretKey,
    jwtRegisterKeyExpire
  );

  //
  const result = await userModel.create({
    ...req.body,
  });

  // prepare email data
  const emailData = {
    email,
    subject: "Account Activation Link",
    verifyToken,
  };

  // send email
  sendAccountVerifyMail(emailData);

  // response send
  successResponse(res, {
    statusCode: 201,
    message: `A verification email sent to ${email}, To create account please verify. `,
    payload: {
      data: result,
    },
  });
});

/**
 *
 * @apiDescription    Verify Register Email
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/auth/verify
 * @apiAccess         Public (register user)
 *
 * @apiSuccess        { success : true , message, date }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 * @apiError          ( Bad Request 400 )  Token not Found
 *
 */

export const activateUserAccount = async (req, res) => {
  const token = req.params.token;
  // check token
  if (!token) {
    throw createError(400, "token not found.");
  }

  try {
    // verify token
    const decoded = jwt.verify(token, jwtVerifyKeySecret);

    // check if user is already verified
    const user = await userModel.findOne({ email: decoded.email });

    if (user) {
      errorResponse(res, {
        statusCode: 400,
        message: "You have already resister. Please login.",
      });
    }

    // create user
    await userModel.create(decoded);

    // response send
    successResponse(res, {
      statusCode: 201,
      message: "User account created successfully.",
    });
  } catch (error) {
    next(createError(400, "Expired Token"));
  }
};

/**
 *
 * @apiDescription    User Login
 * @apiMethod         POST
 *
 * @apiBody           { email, password }
 *
 * @apiRoute          /api/v1/auth/login
 * @apiAccess         Public
 *
 * @apiSuccess        { success : true , message, date }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 * @apiError          ( Not Found 400 )   User not found.
 *
 */

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // field check
  if (!email || !password) {
    throw createError(400, "Please provide email and password");
  }

  // user check
  const loginUser = await userModel.findOne({ email });
  if (!loginUser) {
    res.status(400);
    throw new Error("User not found");
  }

  //  password match
  const isMatch = bcrypt.compareSync(password, loginUser.password);

  if (!isMatch) {
    throw createError(400, "Invalid password");
  }

  // create  access token
  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });

  // create  refresh token
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });

  // cookie set
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 1, // 7 days
    secure: false, // only https
    sameSite: "strict",
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Login",
    payload: {
      loginUser,
    },
  });
});

/**
 *
 * @apiDescription    User Logout
 * @apiMethod         POST
 *
 * @apiCookies        AccessToken
 *
 * @apiRoute          /api/v1/auth/logout
 * @apiAccess         Login User
 *
 * @apiSuccess        { success : true , message, date }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 * @apiError          ( unauthorized 401 )   Unauthorized Only authenticated users can access the data
 *
 */

export const logout = (req, res) => {
  // clear cookies
  res.clearCookie("accessToken", {
    sameSite: "strict",
  });

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Logout.",
  });
};

// refresh token request

export const refreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies.refreshToken) {
    throw createError(401, "Invalid request");
  }

  jwt.verify(
    cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decode) => {
      const { email } = decode;
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

/**
 *
 * @apiDescription    Login User Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/auth/me
 * @apiAccess         Login User
 *
 * @apiSuccess        { success : true , message, date }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 * @apiError          ( unauthorized 401 )   Unauthorized Only authenticated users can access the data
 *
 */

export const me = asyncHandler(async (req, res) => {
  if (!req?.me) {
    throw createError(404, "User not found");
  }

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Login user",
    payload: {
      data: req.me,
    },
  });
});