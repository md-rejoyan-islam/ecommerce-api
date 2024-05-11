import express from "express";
import {
  createTag,
  deleteTagById,
  getAllTag,
  getTagBySlug,
  updateTagById,
} from "../controllers/tag.controllers.mjs";

//create router
const tagRouter = express.Router();

tagRouter.route("/").get(getAllTag).post(createTag);

tagRouter.route("/:slug").get(getTagBySlug);
tagRouter.route("/:id").delete(deleteTagById).patch(updateTagById);

//export
export default tagRouter;
