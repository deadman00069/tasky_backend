import express from "express";
import connectDB from "./database/connect_db.ts";
import AuthRouter from "./routes/auth.route.ts";
import TaskRouter from "./routes/task.route.ts";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/errorMiddleware.ts";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/task", TaskRouter);

app.use(ErrorMiddleware);
app.listen(port, () => {
  connectDB();
  console.log(`Example app listening on port ${port}`);
});
