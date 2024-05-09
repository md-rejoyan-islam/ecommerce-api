import express from "express";
import {
  addBrand,
  allBrand,
  deleteBrand,
  singleBrand,
  updateBrand,
} from "../controllers/brand.controllers.mjs";
import { brandMulter } from "../../middlewares/multer.js";

//create router
const router = express.Router();

router.route("/").get(allBrand).post(brandMulter, addBrand);

router
  .route("/:id")
  .get(singleBrand)
  .delete(deleteBrand)
  .put(brandMulter, updateBrand)
  .patch(brandMulter, updateBrand);

//export
export default router;