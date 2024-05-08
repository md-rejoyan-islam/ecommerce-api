import express from "express";
import {
  addProduct,
  allProduct,
  deleteProduct,
  singleProduct,
  updateProduct,
} from "../controllers/product.controllers.js";
import { productMulter } from "../../utils/multer.js";

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
