import multer from "multer";
import {
  allowedImageTypes,
  brandImageUploadDir,
  categoryImageUploadDir,
  productImageUploadDir,
  userImageUploadDir,
  userMaxImageSize,
} from "../app/secret.mjs";

// create disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // image file size
    const fileSize = parseInt(req.headers["content-length"]);

    // user photo
    if (file.fieldname == "user_photo") {
      if (fileSize > userMaxImageSize) {
        return cb(new Error("Maximum image size is 400KB"));
      }
      cb(null, userImageUploadDir);
    }
    // category image
    else if (file.fieldname == "category_image") {
      if (fileSize > 400000) {
        return cb(new Error("Maximum image size is 400KB"));
      }
      cb(null, categoryImageUploadDir);
    }
    // brand image
    else if (file.fieldname == "brand_image") {
      if (fileSize > 400000) {
        return cb(new Error("Maximum image size is 400KB"));
      }
      cb(null, brandImageUploadDir);
    }
    // product images
    else if (file.fieldname == "product_images") {
      cb(null, productImageUploadDir);
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

// user photo
export const userMulter = multer({
  storage,
  fileFilter,
}).single("user_photo");

// brand photo
export const brandMulter = multer({
  storage,
  fileFilter,
}).single("brand_image");

// product photo
export const productMulter = multer({
  storage,
  fileFilter,
}).array("product_images", 10);

// category photo
export const categoryMulter = multer({
  storage,
  fileFilter,
}).single("category_image");
