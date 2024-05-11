import express from "express";
import {
  createTag,
  deleteTagById,
  getAllTag,
  getTagBySlug,
  updateTagById,
} from "../controllers/tag.controllers.mjs";
import { tagCreateValidator } from "../../middlewares/validators/file/tag.validator";
import runValidation from "../../middlewares/validators/validation";

//create router
const tagRouter = express.Router();

tagRouter
  .route("/")
  .get(getAllTag)
  .post(tagCreateValidator, runValidation, createTag);

tagRouter.route("/:slug").get(getTagBySlug);
tagRouter
  .route("/:id([0-9a-fA-F]{24})")
  .delete(deleteTagById)
  .patch(updateTagById);

//export
export default tagRouter;
