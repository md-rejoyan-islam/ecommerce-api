import { body } from "express-validator";

export const userRegisterValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.Please provide a name.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.Please provide a email.")
    .isEmail()
    .withMessage("Please provide a valid email."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.Please provide a password.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required.Please provide a gender."),

  //   body("photo")
  //     .custom((value, { req }) => {
  //       if (!req.file || !req.file.buffer) {
  //         throw createHttpError(400, "Image is required");
  //       }
  //       return true;
  //     })
  //     .withMessage("Image is required"),
];

export const userLoginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.Please provide a email.")
    .isEmail()
    .withMessage("Please provide a valid email."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.Please provide a password.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const userVerifyCodeValidator = [
  body("code")
    .notEmpty()
    .withMessage("Code is required.Please provide a code.")
    .isLength({ min: 4 })
    .withMessage("Code must be at least 4 characters long."),
];

export const userResendCodeValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.Please provide a email.")
    .isEmail()
    .withMessage("Please provide a valid email."),
];

export const userPasswordUpdateValidator = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw createHttpError(400, "Password does not match");
      }
      return true;
    }),
];

export const userResetPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.Please provide a email.")
    .isEmail()
    .withMessage("Please provide a valid email."),
];

export const resetPasswordValidatorByCode = [
  body("password")
    .notEmpty()
    .withMessage("Password is required.Please provide a password.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw createHttpError(400, "Password does not match");
      }
      return true;
    }),

  body("code")
    .notEmpty()
    .withMessage("Code is required.Please provide a code.")
    .isLength({ min: 4 })
    .withMessage("Code must be at least 4 characters long."),
];


export const resetPasswordValidatorByURL = [
  body("password")
    .notEmpty()
    .withMessage("Password is required.Please provide a password.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw createHttpError(400, "Password does not match");
      }
      return true;
    }),
];