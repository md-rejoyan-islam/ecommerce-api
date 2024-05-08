import express from "express";
import {
  activateUserAccount,
  logout,
  me,
  refreshToken,
  userLogin,
  userRegister,
} from "../controllers/auth.controllers.js";
import tokenVerify from "../../middlewares/tokenVerify.js";
import limiter from "../../middlewares/rateLimiter.js";

//create router
const authRouter = express.Router();

authRouter.route("/register").post(userRegister);
authRouter.route("/verify").get(activateUserAccount);
authRouter.route("/login").post(limiter, userLogin);
authRouter.route("/refresh").get(refreshToken);
authRouter.route("/logout").post(logout);
authRouter.route("/me").get(tokenVerify, me);

//export
export default authRouter;
