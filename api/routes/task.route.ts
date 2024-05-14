import express from "express";
import taskValidationRules from "../rules/task.validation.rules";
import {
  createTask,
  getAllTask,
  getHistory,
  getTask,
  updateTask,
} from "../controller/task.controller";
import verifyTokenMiddleware from "../middleware/verifyToken";

const router = express.Router();

// For getting task hostory
router.get("/history", verifyTokenMiddleware, getHistory);

// For getting single task
router.get("/:taskId", verifyTokenMiddleware, getTask);

/// For creating task
router.post("/", verifyTokenMiddleware, taskValidationRules, createTask);

// For updating task
router.patch("/", verifyTokenMiddleware, taskValidationRules, updateTask);

// For getting all tasks
router.get("/", verifyTokenMiddleware, getAllTask);

export default router;
