import express from "express";

import { productMulter } from "../../middlewares/multer.js";
import {
  createProduct,
  deleteProductBySlug,
  getAllProduct,
  getProductBySlug,
  updateProductById,
} from "../controllers/product.controllers.mjs";
import { productCreateValidator } from "../../middlewares/validators/file/product.validator.js";
import runValidation from "../../middlewares/validators/validation.mjs";

//create router
const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProduct)
  .post(productMulter, productCreateValidator, runValidation, createProduct);

productRouter.route("/:slug").get(getProductBySlug).delete(deleteProductBySlug);
productRouter
  .route("/:id([0-9a-fA-F]{24})")

  .patch(productMulter, updateProductById);

//export
export default productRouter;
