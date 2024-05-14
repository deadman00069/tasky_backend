import { body } from "express-validator";

// Validation rules for user signup
const signupValidationRules = [
  // Validation rule for email field
  body("email")
    .trim()
    .isEmail()
    .withMessage("Not a valid e-mail address"),

  // Validation rule for name field
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  // Validation rule for userName field
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5 })
    .withMessage("Username length must be at least 5 characters"),

  // Validation rule for password field
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password length must be at least 5 characters"),

  // Validation rule for confirmPassword field
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required")
    .isLength({ min: 5 })
    .withMessage("Confirm Password length must be at least 5 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export default signupValidationRules;
