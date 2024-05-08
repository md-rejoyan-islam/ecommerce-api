import fs from "fs/promises";

const deleteImage = async (imagePath) => {
  try {
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    console.log("user image was deleted.");
  } catch (error) {
    console.log("failed to delete user image.");
  }
};


export default deleteImage