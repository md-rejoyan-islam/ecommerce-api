import express from "express";
import { categoryMulter } from "../../middlewares/multer.js";
import { isLoggedIn } from "../../middlewares/verify.mjs";
import {
  categoryCreateValidator,
  categoryUpdateValidator,
} from "../../middlewares/validators/file/category.validator.js";
import runValidation from "../../middlewares/validators/validation.mjs";
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "../controllers/category.controllers.mjs";
import { authorization } from "../../middlewares/authorization.mjs";

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

categoryRouter.route("/:slug").get(getCategoryById);
categoryRouter
  .route("/:id([0-9a-fA-F]{24})")
  .delete(isLoggedIn, authorization("admin"), deleteCategoryById)
  .patch(
    isLoggedIn,
    authorization("admin"),
    categoryMulter,
    categoryUpdateValidator,
    runValidation,
    updateCategoryById
  );

//export
export default categoryRouter;
