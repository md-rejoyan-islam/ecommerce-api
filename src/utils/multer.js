import multer from "multer";

// create disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // image file size
    const fileSize = parseInt(req.headers["content-length"]);

    if (file.fieldname == "category_photo") {
      if (fileSize > 400000) {
        return cb(new Error("Maximum image size is 400KB"));
      }

      // image location
      cb(null, "api/public/images/categories");
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

// multer storage function
function multerDiskStorage(location) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, location);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
}
