import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  singleCategory,
  updateCategory,
} from "../controllers/category.controllers.mjs";
import { categoryMulter } from "../../middlewares/multer.js";
import { isLoggedIn } from "../../middlewares/verify.mjs";
import { categoryCreateValidator } from "../../middlewares/validators/file/category.validator.js";
import runValidation from "../../middlewares/validators/validation.js";

//create router
const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getAllCategories)
  .post(
    isLoggedIn,
    categoryMulter,
    categoryCreateValidator,
    runValidation,
    createCategory
  );

categoryRouter
  .route("/:id")
  .get(singleCategory)
  .delete(deleteCategory)
  .patch(categoryMulter, updateCategory)
  .put(categoryMulter, updateCategory);

//export
export default categoryRouter;
