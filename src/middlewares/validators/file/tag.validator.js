import { body } from "express-validator";

export const tagCreateValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.Please provide a name.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be at least 3-30 characters long."),
  body("slug").optional(),
];
