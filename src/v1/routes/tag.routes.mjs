import express from "express";
import {
  createTag,
  deleteTagById,
  getAllTag,
  getTagBySlug,
  updateTagById,
} from "../controllers/tag.controllers.mjs";
import { tagCreateValidator } from "../../middlewares/validators/file/tag.validator.mjs";
import runValidation from "../../middlewares/validators/validation.mjs";
import { isLoggedIn } from "../../middlewares/verify.mjs";
import { authorization } from "../../middlewares/authorization.mjs";

//create router
const tagRouter = express.Router();

tagRouter
  .route("/")
  .get(getAllTag)
  .post(
    isLoggedIn,
    authorization("admin", "seller"),
    tagCreateValidator,
    runValidation,
    createTag
  );

tagRouter
  .route("/:slug")
  .get(isLoggedIn, authorization("admin", "seller"), getTagBySlug);
tagRouter
  .route("/:id([0-9a-fA-F]{24})")
  .delete(isLoggedIn, authorization("admin", "seller"), deleteTagById)
  .patch(isLoggedIn, authorization("admin", "seller"), updateTagById);

//export
export default tagRouter;
