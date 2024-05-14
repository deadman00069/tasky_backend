import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import ApiError from "../utils/apiError";

// Middleware to verify access token
const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extracting access token from cookies
    const token = req.cookies.accessToken;

    // If token is not provided
    if (!token) {
      throw new ApiError(401, "Access token not provided");
    }

    // Verifying access token
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // If token is invalid
    if (!decodeToken) {
      throw new ApiError(401, "Invalid token");
    }

    // If token is valid, move to next middleware
    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new ApiError(401, "Token Expired");
    }

    // Handling token verification errors
    console.error("Token verification failed:", error.message);
    next(error);
  }
};

export default verifyTokenMiddleware;
