import mongoose from "mongoose";
import "../loadEnv.ts";

// Function to connect to the database
const connectDB = async () => {
  try {
    // Connecting to the database using the URL from environment variables
    await mongoose.connect(process.env.DB_URL);
    console.log("Database is connected");
  } catch (e) {
    // Handling errors if database connection fails
    console.log("Error from connectDB", e);
  }
};

export default connectDB;
