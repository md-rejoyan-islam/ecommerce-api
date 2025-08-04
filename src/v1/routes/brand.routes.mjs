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
import { isLoggedIn } from "../../middlewares/verify.mjs";
import { authorization } from "../../middlewares/authorization.mjs";

//create router
const brandRouter = express.Router();

brandRouter
  .route("/")
  .get(getAllBrand)
  .post(
    isLoggedIn,
    authorization("admin", "seller"),
    brandMulter,
    brandCreateValidator,
    runValidation,
    createBrand
  );

// bulk delete
brandRouter
  .route("/bulk-delete")
  .delete(isLoggedIn, authorization("admin"), bulkDeleteBrandByIds);

brandRouter
  .route("/:slug")
  .get(isLoggedIn, authorization("admin", "seller"), getBrandBySlug);
brandRouter
  .route("/:id([0-9a-fA-F]{24})")
  .delete(isLoggedIn, authorization("admin", "seller"), deleteBrandById)
  .patch(
    isLoggedIn,
    authorization("admin", "seller"),
    brandMulter,
    updateBrandById
  );

//export
export default brandRouter;
