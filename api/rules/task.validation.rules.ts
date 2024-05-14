import { body } from "express-validator";
import { Priority, TaskStatus } from "../utils/enums";
import mongoose from "mongoose";

// Validation rules for user login
const taskValidationRules = [
  // Validation rule for email field
  body("title").notEmpty().withMessage("Title is required"),

  // Validation rule for password field
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description length must be at least 10 characters"),

  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .custom((value: Priority) => {
      if (!Object.values(Priority).includes(value)) {
        throw new Error("Invalid priority value");
      }
      return true;
    }),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid date"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .custom((value: TaskStatus) => {
      if (!Object.values(TaskStatus).includes(value)) {
        throw new Error("Invalid status value");
      }
      return true;
    }),
];

export default taskValidationRules;
