import { body } from "express-validator";

export const brandCreateValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.Please provide a name.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be at least 3-30 characters long."),
  body("slug").optional(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.Please provide a description."),
  body("brand_image")
    .trim()
    .custom((_, { req }) => {
      if (!req.file || !req.file.mimetype.startsWith("image")) {
        throw new Error("Brand image is required.");
      }
      return true;
    }),
];

export const categoryUpdateValidator = [
  body("name")
    .trim()
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be at least 3-30 characters long."),
  body("slug").trim().optional(),
  body("description").optional(),
  body("category_image").optional(),
  body("parent").optional(),
];
