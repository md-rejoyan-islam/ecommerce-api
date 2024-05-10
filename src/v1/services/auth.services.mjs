import asyncHandler from "express-async-handler";
import createError from "http-errors";
import bcrypt from "bcryptjs";
import userModel from "../../models/user.model.mjs";
import createJWT from "../../helper/createJWT.js";
import {
  accessTokenExpire,
  accessTokenSecret,
  jwtRegisterKeyExpire,
  jwtRegisterSecretKey,
  refreshTokenExpire,
  refreshTokenSecret,
} from "../../app/secret.js";
import sendAccountVerifyMail from "../../mails/accountVerifyMail.mjs";
import { setCookie } from "../../helper/cookie.mjs";

/**
 * @description User Register Service
 * @param {Object} req
 * @returns {Promise}
 */
export const userRegisterService = asyncHandler(async (data) => {
  // check if user exist
  const user = await userModel.exists({ email: data.email });

  if (user) {
    throw createError.Conflict("Already have an account with this email.");
  }

  // create verify token
  const verifyToken = await createJWT(
    data,
    jwtRegisterSecretKey,
    jwtRegisterKeyExpire
  );

  // prepare email data
  const emailData = {
    email: data.email,
    subject: "Account Activation Link",
    verifyToken,
  };

  // send email
  await sendAccountVerifyMail(emailData);

  return verifyToken;
});

// user login service
export const userLoginService = asyncHandler(async (res, data) => {
  const { email, password } = data;

  // find user
  const loginUser = await userModel.findOne({ email }).select("+password");

  if (!loginUser) {
    throw createError(400, "User not found.Please register.");
  }

  //  password match
  const isMatch = bcrypt.compareSync(password, loginUser.password);

  if (!isMatch) {
    throw createError(400, "Wrong password. Please try again.");
  }

  // check user is banned
  if (loginUser.isBanned) {
    throw createError(
      403,
      "Your account is banned. Please contact with admin."
    );
  }

  // create  access token
  const accessToken = await createJWT(
    { email, role: loginUser.role },
    accessTokenSecret,
    accessTokenExpire
  );

  // create  refresh token
  const refreshToken = await createJWT(
    { email },
    refreshTokenSecret,
    refreshTokenExpire
  );

  // access token set to cookie
  setCookie({
    res,
    cookieName: "accessToken",
    cookieValue: accessToken,
    maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
  });

  // refresh token set to cookie
  setCookie({
    res,
    cookieName: "refreshToken",
    cookieValue: refreshToken,
    maxAge: 1000 * 60 * 60 * 24 * 70, // 70 days
  });

  // password field remove
  delete loginUser._doc.password;

  return loginUser;
});

// refresh token service
export const refreshTokenService = asyncHandler(async (res, email) => {
  // find user
  const user = await userModel.findOne({ email });

  if (!user) {
    throw createError(404, "Couldn't find any user");
  }

  // create access token
  const accessToken = await createJWT(
    { email },
    accessTokenSecret,
    accessTokenExpire
  );

  // access token set to cookie
  setCookie({
    res,
    cookieName: "accessToken",
    cookieValue: accessToken,
    maxAge: 1000 * 60 * 1, // 1 min
  });

  return accessToken;
});

// active user account service
export const activeUserAccountService = asyncHandler(async (data) => {
  // check if user is already verified
  const user = await userModel.findOne({ email: data.email });

  if (user) {
    throw createError(400, "User already verified.");
  }

  // create user
  const result = await userModel.create(data);

  return result;
});
