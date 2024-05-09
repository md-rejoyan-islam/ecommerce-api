import fs from "fs/promises";
import asyncHandler from "express-async-handler";
import { defaultImagePath } from "../app/secret.js";

const deleteImage = asyncHandler(async (imagePath) => {
  try {
    // default image can't be deleted
    if (imagePath.includes(defaultImagePath)) {
      console.log("default image can't be deleted.");
      return;
    }
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    console.log("user image was deleted.");
  } catch (error) {
    console.log("failed to delete user image.");
  }
});

export default deleteImage;
