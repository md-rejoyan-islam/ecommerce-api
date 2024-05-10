import express from "express";
import {
  banUserById,
  createUser,
  deleteUserById,
  findUserById,
  getAllUsers,
  unbanUserById,
  updateUserById,
} from "../controllers/user.controllers.mjs";
import { authorization } from "../../middlewares/authorization.mjs";
import { userMulter } from "../../middlewares/multer.js";
import { userMulterForBuffer } from "../../middlewares/multerForBuffer.mjs";
import { isLoggedIn } from "../../middlewares/verify.mjs";
import { userRegisterValidator } from "../../middlewares/validators/file/user.validator.js";
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
    path: "/:id",
    method: "get",
    middleware: [isLoggedIn, authorization("admin", "user")],
    route: findUserById,
  },
  {
    path: "/:id",
    method: "delete",
    middleware: [isLoggedIn, authorization("admin", "user")],
    route: deleteUserById,
  },
  {
    path: "/:id",
    method: "put",
    middleware: [userMulter],
    route: updateUserById,
  },
  {
    path: "/:id",
    method: "patch",
    middleware: [userMulter],
    route: updateUserById,
  },
  {
    path: "/ban-user/:id",
    method: "patch",
    middleware: [isLoggedIn, authorization("admin")],
    route: banUserById,
  },
  {
    path: "/unban-user/:id",
    method: "patch",
    middleware: [isLoggedIn, authorization("admin")],
    route: unbanUserById,
  },
];

moduleRoutes.forEach((route) => {
  userRouter[route.method](route.path, route.middleware, route.route);
});

export default userRouter;
