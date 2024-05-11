import multer from "multer";
import {
  allowedImageTypes,
  userImageUploadDir,
  userMaxImageSize,
} from "../app/secret.js";

// create disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // image file size
    const fileSize = parseInt(req.headers["content-length"]);

    if (file.fieldname == "user_photo") {
      if (fileSize > userMaxImageSize) {
        return cb(new Error("Maximum image size is 400KB"));
      }

      // image location
      cb(null, userImageUploadDir);
    }
    if (file.fieldname == "category_image") {
      if (fileSize > 400000) {
        return cb(new Error("Maximum image size is 400KB"));
      }
      cb(null, "public/images/categories");
    }
    if (file.fieldname == "brand_image") {
      if (fileSize > 400000) {
        return cb(new Error("Maximum image size is 400KB"));
      }
      cb(null, "public/images/brands");
    }
    if (file.fieldname == "product_images") {
      cb(null, "/public/images/products");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const fileExtension = file.mimetype.split("/")[1];

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
export const userMulter = multer({
  storage,
  fileFilter,
}).single("user_photo");

// brand
export const brandMulter = multer({
  storage,
  fileFilter,
}).single("brand_image");

// product
export const productMulter = multer({
  storage,
  fileFilter,
}).array("product_images", 10);

// product category middleware
export const categoryMulter = multer({
  storage,
  fileFilter,
}).single("category_image");
