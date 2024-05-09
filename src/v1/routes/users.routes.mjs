import express from "express";
import {
  createUser,
  deleteUserById,
  findUserById,
  getAllUsers,
  updateUserById,
} from "../controllers/user.controllers.mjs";
import { authorization } from "../controllers/authorization.mjs";
import { userMulter } from "../../middlewares/multer.js";
import { userMulterForBuffer } from "../../middlewares/multerForBuffer.mjs";

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
  .put(userMulter, updateUserById)
  .patch(userMulter, updateUserById);

export default userRouter;