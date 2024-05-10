import { body } from "express-validator";

export const categoryCreateValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.Please provide a name.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be at least 3-30 characters long."),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required.Please provide a slug.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Slug must be at least 3-30 characters long."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.Please provide a description."),
  body("category_image")
    .trim()
    .custom((_, { req }) => {
      if (!req.file || !req.file.mimetype.startsWith("image")) {
        throw new Error("Category image is required.");
      }
      return true;
    }),
  body("parent").optional(),
];
