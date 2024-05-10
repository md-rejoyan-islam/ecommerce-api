import asyncHandler from "express-async-handler";
import createError from "http-errors";
import userModel from "../../models/user.model.mjs";
import createJWT from "../../helper/createJWT.js";
import {
  jwtRegisterKeyExpire,
  jwtRegisterSecretKey,
} from "../../app/secret.js";
import sendAccountVerifyMail from "../../utils/accountVerifyMail.js";

/**
 * @description User Register Service
 * @param {Object} req
 * @returns {Promise}
 */
export const userRegisterService = asyncHandler(async (req) => {
  // check if user exist
  const user = await userModel.exists({ email: req.body.email });

  if (user) {
    throw createError.Conflict("Already have an account with this email.");
  }

  // create verify token
  const verifyToken = await createJWT(
    { ...req.body },
    jwtRegisterSecretKey,
    jwtRegisterKeyExpire
  );

  // prepare email data
  const emailData = {
    email,
    subject: "Account Activation Link",
    verifyToken,
  };

  // send email
  await sendAccountVerifyMail(emailData);
});
