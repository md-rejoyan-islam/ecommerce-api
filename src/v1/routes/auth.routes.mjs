import express from "express";
import {
  activateUserAccount,
  logout,
  me,
  refreshToken,
  userLogin,
  userRegister,
} from "../controllers/auth.controllers.mjs";
import limiter from "../../middlewares/rateLimiter.mjs";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../../middlewares/validators/file/user.validator.js";
import runValidation from "../../middlewares/validators/validation.mjs";
import { isLoggedIn, isLoggedOut } from "../../middlewares/verify.mjs";

//create router
const authRouter = express.Router();

authRouter
  .route("/register")
  .post(
    limiter,
    isLoggedOut,
    userRegisterValidator,
    runValidation,
    userRegister
  );
authRouter.route("/activate").post(activateUserAccount);
authRouter
  .route("/login")
  .post(limiter, isLoggedOut, userLoginValidator, runValidation, userLogin);
authRouter.route("/refresh-token").get(refreshToken);
authRouter.route("/logout").post(isLoggedIn, logout);
authRouter.route("/me").get(isLoggedIn, me);

//export
export default authRouter;
