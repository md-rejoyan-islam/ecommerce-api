import asyncHandler from "express-async-handler";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { jwtRegisterSecretKey, refreshTokenSecret } from "../../app/secret.mjs";
import { clearCookie } from "../../helper/cookie.mjs";
import { successResponse } from "../services/responseHandler.mjs";
import {
  activeUserAccountService,
  refreshTokenService,
  userLoginService,
  userRegisterService,
} from "../services/auth.services.mjs";

/**
 *
 * @apiDescription    User Register
 * @apiMethod         POST
 *
 * @apiRoute          /api/v1/auth/register
 * @apiAccess         Public
 *
 * @apiSuccess        { success : true , message, data : {} }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 */
export const userRegister = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // register service
  const verifyToken = await userRegisterService(req.body);

  // response send
  successResponse(res, {
    statusCode: 201,
    message: `A verification email sent to ${email}, To create account please verify. `,
    payload: {
      verifyToken,
    },
  });
});

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
 * @apiSuccess        { success : true , message, data:{} }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 */

export const userLogin = asyncHandler(async (req, res) => {
  const loginUser = await userLoginService(res, req.body);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Login.",
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
 * @apiCookies        AccessToken, RefreshToken
 *
 * @apiRoute          /api/v1/auth/logout
 * @apiAccess         Login User
 *
 * @apiSuccess        { success : true , message, data:{} }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 */

export const logout = (_, res) => {
  // clear cookies
  clearCookie(res, "accessToken");
  clearCookie(res, "refreshToken");

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Successfully Logout.",
  });
};

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

export const activateUserAccount = asyncHandler(async (req, res) => {
  const { token } = req.body;
  // check token
  if (!token) throw createError(404, "token is required.");

  // verify token
  const decoded = jwt.verify(token, jwtRegisterSecretKey);

  if (!decoded) {
    throw createError(401, "Invalid token");
  }

  // find user
  const result = await activeUserAccountService(decoded);

  // response send
  successResponse(res, {
    statusCode: 201,
    message: "User account created successfully.",
    payload: {
      data: result,
    },
  });
});

/**
 * @apiDescription    Refresh Token
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/auth/refresh-token
 *
 * @apiSuccess        { success : true , message, data:{} }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 */

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createError(401, "Refresh token not found");
  }

  // verify token
  const { email } = jwt.verify(refreshToken, refreshTokenSecret);

  if (!email) {
    throw createError(401, "Invalid token");
  }

  const accessToken = await refreshTokenService(res, email);

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Token refreshed",
    payload: {
      accessToken,
    },
  });
});

/**
 *
 * @apiDescription    Login User Data
 * @apiMethod         GET
 *
 * @apiRoute          /api/v1/auth/me
 * @apiAccess         Login User
 *
 * @apiSuccess        { success : true , message, data:{} }
 * @apiFailed         { success : false, error : { status : code , message} }
 *
 */

export const me = asyncHandler(async (req, res) => {
  if (!req?.me) {
    throw createError(404, "User not found");
  }

  // response send
  successResponse(res, {
    statusCode: 200,
    message: "Login user data.",
    payload: {
      data: req.me,
    },
  });
});
