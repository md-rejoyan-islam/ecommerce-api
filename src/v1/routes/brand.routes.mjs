import express from "express";

import { brandMulter } from "../../middlewares/multer.mjs";
import {
  bulkDeleteBrandByIds,
  createBrand,
  deleteBrandById,
  getAllBrand,
  getBrandBySlug,
  updateBrandById,
} from "../controllers/brand.controllers.mjs";
import { brandCreateValidator } from "../../middlewares/validators/file/brand.validator.mjs";
import runValidation from "../../middlewares/validators/validation.mjs";

//create router
const brandRouter = express.Router();

brandRouter
  .route("/")
  .get(getAllBrand)
  .post(brandMulter, brandCreateValidator, runValidation, createBrand);

// bulk delete
brandRouter.route("/bulk-delete").delete(bulkDeleteBrandByIds);

brandRouter.route("/:slug").get(getBrandBySlug);
brandRouter
  .route("/:id([0-9a-fA-F]{24})")
  .delete(deleteBrandById)
  .patch(brandMulter, updateBrandById);

//export
export default brandRouter;
