import express from "express";
import { categoryMulter } from "../../middlewares/multer.js";
import { isLoggedIn } from "../../middlewares/verify.mjs";
import { categoryCreateValidator } from "../../middlewares/validators/file/category.validator.js";
import runValidation from "../../middlewares/validators/validation.js";
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "../controllers/category.controllers.mjs";

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
  .route("/:id([0-9a-fA-F]{24})")
  .get(getCategoryById)
  .delete(deleteCategoryById)
  .patch(categoryMulter, updateCategoryById);

//export
export default categoryRouter;
