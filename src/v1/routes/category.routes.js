import express from "express";
import {
  addCategory,
  allCategories,
  deleteCategory,
  singleCategory,
  updateCategory,
} from "../controllers/category.controllers.js";
import { categoryMulter } from "../../middlewares/multer.js";

//create router
const router = express.Router();

router.route("/").get(allCategories).post(categoryMulter, addCategory);

router
  .route("/:id")
  .get(singleCategory)
  .delete(deleteCategory)
  .patch(categoryMulter, updateCategory)
  .put(categoryMulter, updateCategory);

//export
export default router;
