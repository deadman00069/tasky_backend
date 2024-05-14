import { Schema } from "mongoose";
import { Priority, TaskStatus } from "../utils/enums";

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
  createdBy: Schema.Types.ObjectId;
}
