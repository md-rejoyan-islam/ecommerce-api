import express from "express";
import {
  addTag,
  allTag,
  deleteTag,
  singleTag,
  updateTag,
} from "../controllers/tag.controllers.js";

//create router
const router = express.Router();

router.route("/").get(allTag).post(addTag);

router.route("/:id")
.get(singleTag)
.delete(deleteTag)
.patch(updateTag);

//export
export default router;
