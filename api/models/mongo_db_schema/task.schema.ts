import { Schema } from "mongoose";
import mongoose from "mongoose";
import { Task } from "../task.ts";
import { Priority, TaskStatus } from "../../utils/enums.ts";

const taskSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: [true, "This field is required"],
    },

    description: {
      type: String,
      required: [true, "This field is required"],
    },

    priority: {
      type: Number,
      enum: Priority,
      default: Priority.low,
    },

    dueDate: {
      type: String,
      required: [true, "this field is required"],
    },

    status: {
      type: Number,
      enum: TaskStatus,
      default: TaskStatus.pending,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model("Task", taskSchema);

export { TaskModel, taskSchema };
