import multer from "multer";
import {
  allowedImageTypes,
  userImageUploadDir,
  userMaxImageSize,
} from "../app/secret.mjs";

// create disk storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const fileExtension = file.mimetype.split("/")[1];

  if (file.size > userMaxImageSize) {
    return cb(new Error("Maximum image size is 400KB"));
  }

  if (allowedImageTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only jpg, jpeg, png, webp files are allowed"
      ),
      false
    );
  }
};

// user
export const userMulterForBuffer = multer({
  storage: storage,
  fileFilter,
}).single("user_photo");
