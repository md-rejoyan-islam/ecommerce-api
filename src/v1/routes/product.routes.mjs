import express from "express";

import { productMulter } from "../../middlewares/multer.js";
import {
  createProduct,
  deleteProductById,
  getAllProduct,
  getProductBySlug,
  updateProductById,
} from "../controllers/product.controllers.mjs";

//create router
const productRouter = express.Router();

productRouter.route("/").get(getAllProduct).post(productMulter, createProduct);

productRouter.route("/:slug").get(getProductBySlug);
productRouter
  .route("/:id([0-9a-fA-F]{24})")
  .delete(deleteProductById)
  .patch(productMulter, updateProductById);

//export
export default productRouter;
