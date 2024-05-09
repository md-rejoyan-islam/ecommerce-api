import multer from "multer";
import { userImageUploadDir } from "../app/secret.js";

// create disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // image file size
    const fileSize = parseInt(req.headers["content-length"]);

    if (file.fieldname == "user_photo") {
      if (fileSize > 400000) {
        return cb(new Error("Maximum image size is 400KB"));
      }

      // image location
      cb(null, userImageUploadDir);
    }
    if (file.fieldname == "brand_photo") {
      if (fileSize > 400000) {
        return cb(new Error("Maximum image size is 400KB"));
      }
      cb(null, "api/public/images/brands");
    }
    if (
      file.fieldname == "product_photo" ||
      file.fieldname == "product_gallery_photo"
    ) {
      cb(null, "api/public/images/products");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// user
export const userMulter = multer({
  storage: storage,
}).single("user_photo");

// brand
export const brandMulter = multer({
  storage: storage,
}).single("brand_photo");

// product
export const productMulter = multer({
  storage: storage,
}).fields([
  {
    name: "product_photo",
    maxCount: 1,
  },
  {
    name: "product_gallery_photo",
    maxCount: 10,
  },
]);

// product category middleware
export const categoryMulter = multer({
  storage: storage,
}).single("category_photo");
