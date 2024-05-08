import { isValidObjectId } from "mongoose";
import createError from "http-errors";

const checkMongoId = (id) => {
  if (!isValidObjectId(id)) {
    throw createError(400, "Invalid id");
  }
};

export default checkMongoId;
