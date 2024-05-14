import { body } from "express-validator";

// Validation rules for user login
const loginValidationRules = [
  // Validation rule for email field
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Not a valid e-mail address"),
  // Validation rule for password field
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password length must be at least 5 characters"),
];

export default loginValidationRules;
