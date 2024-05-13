import { body } from "express-validator";
import { isValidObjectId } from "mongoose";

export const productCreateValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.Please provide a name.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),
  body("slug").optional(),
  body("title")
    .notEmpty()
    .withMessage("Title is required.Please provide a title.")
    .isLength({ min: 10 })
    .withMessage("Title must be at least 10 characters long."),
  body("brand")
    .notEmpty()
    .withMessage("Brand id is required.Please provide a brand id.")
    .isMongoId()
    .withMessage("Brand id is not valid."),
  body("category")
    .notEmpty()
    .withMessage("Category id is required.Please provide a category id.")
    .isMongoId()
    .withMessage("Category id is not valid."),
  body("tags")
    .notEmpty()
    .withMessage("Tags are required.Please provide tags.")
    .isArray()
    .withMessage("Tags must be an array.")
    .custom((tags) => {
      if (tags.length < 1) {
        throw new Error("Tags must be at least 1.");
      }
      // id check
      for (let tag of tags) {
        if (!isValidObjectId(tag)) {
          throw new Error(`${tag} is not a valid tag id.`);
        }
      }
      return true;
    }),

  body("description")
    .isObject()
    .withMessage("Description is required.Please provide a description."),
  body("description.short")
    .notEmpty()
    .withMessage(
      "Short description is required.Please provide a short description."
    )
    .trim()
    .isLength({ min: 15 })
    .withMessage("Short description must be at least 15 characters long."),
  body("description.long")
    .notEmpty()
    .withMessage(
      "Long description is required.Please provide a long description."
    )
    .trim()
    .isLength({ min: 30 })
    .withMessage("Long description must be at least 30 characters long."),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required.Please provide a quantity.")
    .isNumeric()
    .withMessage("Quantity must be a number."),
  body("sold").optional().isNumeric().withMessage("Sold must be a number."),
  body("rating").optional().isNumeric().withMessage("Rating must be a number."),
  body("price")
    .isObject()
    .withMessage("Price is required.Please provide a price."),
  body("price.regular")
    .notEmpty()
    .withMessage("Regular price is required.Please provide a regular price.")
    .isNumeric()
    .withMessage("Regular price must be a number."),
  body("price.sale")
    .optional()
    .isNumeric()
    .withMessage("Sale price must be a number."),
  body("shipping")
    .isObject()
    .withMessage("Shipping is required.Please provide a shipping."),
  body("shipping.type")
    .notEmpty()
    .withMessage("Shipping type is required.Please provide a shipping type.")
    .isString()
    .withMessage("Shipping type must be a string."),
  body("shipping.fee")
    .isNumeric()
    .withMessage("Shipping fee must be a number.")
    .custom((value, { req }) => {
      if (req.body.shipping.type === "free" && !value) {
        console.log(2);
        req.body.shipping.fee = 0;
      }
      return true;
    }),
  body("product_images")
    .trim()
    .custom((_, { req }) => {
      if (!req.files.length) {
        throw new Error("Product images are required.");
      }
      return true;
    }),
];
