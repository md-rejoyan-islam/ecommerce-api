import express from "express";
import {
  activateUserAccount,
  logout,
  me,
  refreshToken,
  userLogin,
  userRegister,
} from "../controllers/auth.controllers.js";
import limiter from "../../middlewares/rateLimiter.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../../middlewares/validators/file/user.validator.js";
import runValidation from "../../middlewares/validators/validation.js";

//create router
const authRouter = express.Router();

authRouter
  .route("/register")
  .post(limiter, userRegisterValidator, runValidation, userRegister);
authRouter.route("/activate").post(activateUserAccount);
authRouter
  .route("/login")
  .post(limiter, userLoginValidator, runValidation, userLogin);
authRouter.route("/refresh").get(refreshToken);
authRouter.route("/logout").post(logout);
authRouter.route("/me").get(me);

//export
export default authRouter;
