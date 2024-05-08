import express from "express";
import {
  createUser,
  deleteUserById,
  findUserById,
  getAllUsers,
  updateUser,
} from "../controllers/user.controllers.js";
import tokenVerify from "../../middlewares/tokenVerify.js";
import { authorization } from "../controllers/authorization.js";

const userRouter = express.Router();

// router.use(tokenVerify);

userRouter.route("/").get(getAllUsers).post(createUser);

// userRouter
//   .route("/:id")
//   .get(authorization("admin", "user"), findUserById)
//   .delete(authorization("admin", "user"), deleteUser)
//   .put(authorization("admin", "user"), updateUser)
//   .patch(authorization("admin", "user"), updateUser);

userRouter
  .route("/:id")
  .get(findUserById)
  .delete(deleteUserById)
  .put(updateUser)
  .patch(updateUser);

export default userRouter;