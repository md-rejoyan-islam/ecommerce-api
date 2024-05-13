import express from "express";

import { productMulter } from "../../middlewares/multer.js";
import {
  createProduct,
  deleteProductBySlug,
  getAllProduct,
  getProductBySlug,
  updateProductBySlug,
} from "../controllers/product.controllers.mjs";
import {
  productCreateValidator,
  productUpdateValidator,
} from "../../middlewares/validators/file/product.validator.js";
import runValidation from "../../middlewares/validators/validation.mjs";

//create router
const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProduct)
  .post(productMulter, productCreateValidator, runValidation, createProduct);

productRouter
  .route("/:slug")
  .get(getProductBySlug)
  .delete(deleteProductBySlug)
  .patch(
    productMulter,
    productUpdateValidator,
    runValidation,
    updateProductBySlug
  );

//export
export default productRouter;
