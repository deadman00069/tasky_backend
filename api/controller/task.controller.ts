import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../utils/apiError";
import { TaskModel } from "../models/mongo_db_schema/task.schema";
import { ApiResponse } from "../utils/apiResponse";
import { Task } from "../models/task";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";
import mongoose, { Model } from "mongoose";
import { TaskHistoryAggregate } from "../aggregations/task_history_aggregate";

// decoding token
const decodeToken = (req: Request): string | JwtPayload => {
  let token: string | undefined;

  // Extracting access token from cookies
  // token = req.cookies.accessToken || req.headers.authorization;
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization) {
    // Extract token from Authorization header if not found in cookies
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim(); // Remove 'Bearer ' prefix
    }
  }

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

// Creating new task
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array().at(0).msg, errors.array());
    }

    // Getting token and decoding it

    const decodeData = decodeToken(req) as User;

    // task obejct
    const taskData = {
      ...req.body,
      createdBy: decodeData._id,
    };

    // creating new task
    const task = new TaskModel(taskData);
    await task.save();

    // sending response
    res
      .status(201)
      .json(new ApiResponse(201, task, "Task creation successful"));
  } catch (error) {
    next(error);
  }
};

// GEtting all task of perticular user
export const getAllTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Getting token and decoding it
    // const token = req.cookies.accessToken;
    const decodeData = decodeToken(req) as User;

    const statusString = req.query.status as string;

    // Convert status string to its corresponding number
    let status: number | undefined;
    if (statusString) {
      switch (statusString) {
        case "pending":
          status = 0;
          break;
        case "ongoing":
          status = 1;
          break;
        case "completed":
          status = 2;
          break;
        default:
          throw new ApiError(400, "Invalid status value");
      }
    }

    const query = status
      ? { createdBy: decodeData._id, status: status }
      : { createdBy: decodeData._id };

    // Finding all task of perticualr user
    const tasks = await TaskModel.find(query);

    // Not found
    if (!tasks) {
      throw new ApiError(404, "Task not find");
    }

    // For formatting date
    for (let i = 0; i < tasks.length; i++) {
      const date = new Date(tasks[i].dueDate);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = formatter.format(date);
      tasks[i].dueDate = formattedDate;
    }

    // success
    res.status(200).json(new ApiResponse(200, tasks, "Task retrival success"));
  } catch (error) {
    next(error);
  }
};

// Getting perticualr task by id
export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // checking if id is provided
    const taskId = req.params.taskId;
    if (!taskId) {
      throw new ApiError(400, "Task id is not provided.");
    }

    // Finding task
    const task = await TaskModel.findById(
      taskId,
      "title description priority dueDate status"
    ).exec();

    // If not found
    if (!task) {
      throw new ApiError(404, "task not found");
    }

    // success
    res.status(200).json(new ApiResponse(200, task, "Task fetch success"));
  } catch (error) {
    next(error);
  }
};

// Udating task
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array().at(0).msg, errors.array());
    }

    // Getting token and decoding it
    const token = req.cookies.accessToken;
    const decodeData = decodeToken(token) as User;

    // task object
    const task = { ...req.body, createdBy: decodeData._id } as Task;

    //updating task
    await TaskModel.findByIdAndUpdate(task._id, task).exec();

    //success
    res.status(200).json(new ApiResponse(200, "Update success"));
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodeData = decodeToken(req) as User;
    const result = await TaskModel.aggregate(
      TaskHistoryAggregate(decodeData._id)
    );
    res.status(200).json(new ApiResponse(200, result, "History fetch success"));
  } catch (error) {
    console.error("Error aggregating users:", error);
  }
};
