import multer from "multer";
import { userImageUploadDir } from "../secret.js";
import createError from "http-errors";
import path from "path";

// create disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // image file size
    const fileSize = parseInt(req.headers["content-length"]);

    if (file.fieldname == "photo") {
      if (fileSize > 400000) {
        return cb(createError(400, "Maximum image size is 400KB"));
      }

      // image location
      cb(null, userImageUploadDir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // image extension fixed
  const supportedImageExtension = /(png|jpg|jpeg|webp)/;
  const fileExtension = path.extname(file.originalname);
  if (supportedImageExtension.test(fileExtension)) {
    cb(null, true);
  } else {
    cb(createError("Only PNG/JPG/JPEG/WEBP image accepted"), false);
  }
};

// user
export const userMulter = multer({
  storage: storage,
  fileFilter,
}).single("photo");
