import express from "express";
import {
  banUserById,
  createUser,
  deleteUserById,
  findUserById,
  forgotPasswordByEmail,
  getAllUsers,
  resetPassword,
  unbanUserById,
  updatePasswordById,
  updateUserById,
} from "../controllers/user.controllers.mjs";
import { authorization } from "../../middlewares/authorization.mjs";
import { userMulter } from "../../middlewares/multer.js";
import { userMulterForBuffer } from "../../middlewares/multerForBuffer.mjs";
import { isLoggedIn } from "../../middlewares/verify.mjs";
import {
  resetPasswordValidatorByCode,
  userPasswordUpdateValidator,
  userRegisterValidator,
  userResetPasswordValidator,
} from "../../middlewares/validators/file/user.validator.js";
import runValidation from "../../middlewares/validators/validation.js";

const userRouter = express.Router();

const moduleRoutes = [
  {
    path: "/",
    method: "get",
    middleware: [isLoggedIn, authorization("admin")],
    route: getAllUsers,
  },
  {
    path: "/",
    method: "post",
    middleware: [
      isLoggedIn,
      authorization("admin"),
      userRegisterValidator,
      runValidation,
    ],
    route: createUser,
  },
  {
    path: "/ban-user/:id([0-9a-fA-F]{24})",
    method: "patch",
    middleware: [isLoggedIn, authorization("admin")],
    route: banUserById,
  },
  {
    path: "/unban-user/:id([0-9a-fA-F]{24})",
    method: "patch",
    middleware: [isLoggedIn, authorization("admin")],
    route: unbanUserById,
  },
  {
    path: "/update-password/:id([0-9a-fA-F]{24})",
    method: "patch",
    middleware: [
      isLoggedIn,
      userPasswordUpdateValidator,
      runValidation,
      authorization("admin", "user"),
    ],
    route: updatePasswordById,
  },
  {
    path: "/forgot-password/:email",
    method: "get",
    middleware: [isLoggedIn, authorization("admin", "user")],
    route: forgotPasswordByEmail,
  },
  {
    path: "/reset-password",
    method: "patch",
    middleware: [
      isLoggedIn,
      userResetPasswordValidator,
      runValidation,
      authorization("admin", "user"),
    ],
    route: resetPassword,
  },
  {
    path: "/:id([0-9a-fA-F]{24})",
    method: "get",
    middleware: [isLoggedIn, authorization("admin", "user")],
    route: findUserById,
  },
  {
    path: "/:id([0-9a-fA-F]{24})",
    method: "delete",
    middleware: [isLoggedIn, authorization("admin", "user")],
    route: deleteUserById,
  },
  {
    path: "/:id([0-9a-fA-F]{24})",
    method: "put",
    middleware: [userMulter],
    route: updateUserById,
  },
  {
    path: "/:id([0-9a-fA-F]{24})",
    method: "patch",
    middleware: [userMulter],
    route: updateUserById,
  },
];

moduleRoutes.forEach((route) => {
  userRouter[route.method](route.path, route.middleware, route.route);
});

export default userRouter;
