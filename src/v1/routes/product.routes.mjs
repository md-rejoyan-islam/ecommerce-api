import express from "express";

import { productMulter } from "../../middlewares/multer.mjs";
import {
  addProductToWishList,
  createProduct,
  deleteProductBySlug,
  getAllProduct,
  getProductBySlug,
  removeProductFromWishList,
  updateProductBySlug,
} from "../controllers/product.controllers.mjs";
import {
  productCreateValidator,
  productUpdateValidator,
} from "../../middlewares/validators/file/product.validator.mjs";
import runValidation from "../../middlewares/validators/validation.mjs";
import { isLoggedIn } from "../../middlewares/verify.mjs";
import { authorization } from "../../middlewares/authorization.mjs";

//create router
const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProduct)
  .post(
    isLoggedIn,
    authorization("admin", "seller"),
    productMulter,
    productCreateValidator,
    runValidation,
    createProduct
  );

productRouter
  .route("/add-to-wishlist/:id([0-9a-fA-F]{24})")
  .patch(isLoggedIn, authorization("user"), addProductToWishList);
productRouter
  .route("/remove-from-wishlist/:id([0-9a-fA-F]{24})")
  .patch(isLoggedIn, authorization("user"), removeProductFromWishList);

productRouter
  .route("/:slug")
  .get(getProductBySlug)
  .delete(isLoggedIn, authorization("admin", "seller"), deleteProductBySlug)
  .patch(
    isLoggedIn,
    authorization("admin", "seller"),
    productMulter,
    productUpdateValidator,
    runValidation,
    updateProductBySlug
  );

//export
export default productRouter;
