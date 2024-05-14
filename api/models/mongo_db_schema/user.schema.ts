import { Schema } from "mongoose";
import mongoose from "mongoose";
import { User } from "../user";
import jwt from "jsonwebtoken";

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    refreshToken: {
      type: String,
      required: false,
    },

    userName: {
      type: String,
      required: [true, "Please enter user name"],
      unique: true,
      min: [6, "Must be at least 6, got {VALUE}"],
    },

    email: {
      type: String,
      required: [true, "Please enter user name"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please enter password"],
      min: [6, "Must be at least 6, got {VALUE}"],
    },
  },
  {
    timestamps: true,
  }
);

// Exclude password field from toJSON
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;
  return userObject;
};

UserSchema.methods.generateAccessToken = function (): string {
  // Generate the JWT token
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET || "defaultSecret", // Use a default secret if environment variable is not set
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "5h", // Use a default expiry if environment variable is not set
    }
  );
};

UserSchema.methods.generateRefreshToken = function (): string {
  // Generate the JWT token

  const token = jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET || "defaultSecret", // Use a default secret if environment variable is not set
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1h", // Use a default expiry if environment variable is not set
    }
  );
  return token;
};
const UserModel = mongoose.model("User", UserSchema);

export { UserModel, UserSchema };
