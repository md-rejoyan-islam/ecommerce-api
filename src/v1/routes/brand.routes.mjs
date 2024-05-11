import express from "express";

import { brandMulter } from "../../middlewares/multer.js";
import {
  createBrand,
  deleteBrandById,
  getAllBrand,
  getBrandBySlug,
  updateBrandById,
} from "../controllers/brand.controllers.mjs";
import { brandCreateValidator } from "../../middlewares/validators/file/brand.validator.js";
import runValidation from "../../middlewares/validators/validation.mjs";

//create router
const brandRouter = express.Router();

brandRouter
  .route("/")
  .get(getAllBrand)
  .post(brandMulter, brandCreateValidator, runValidation, createBrand);

brandRouter.route("/:slug").get(getBrandBySlug);
brandRouter
  .route("/:id([0-9a-fA-F]{24})")
  .delete(deleteBrandById)
  .patch(brandMulter, updateBrandById);

//export
export default brandRouter;
