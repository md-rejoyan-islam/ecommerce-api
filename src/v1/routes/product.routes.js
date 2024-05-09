import express from "express";
import {
  addProduct,
  allProduct,
  deleteProduct,
  singleProduct,
  updateProduct,
} from "../controllers/product.controllers.mjs";
import { productMulter } from "../../middlewares/multer.js";

//create router
const router = express.Router();

router.route("/").get(allProduct).post(productMulter, addProduct);

router
  .route("/:id")
  .get(singleProduct)
  .delete(deleteProduct)
  .patch(productMulter, updateProduct);

//export
export default router;
