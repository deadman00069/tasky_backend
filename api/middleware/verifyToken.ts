import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { request } from "http";

// Middleware to verify access token
const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    // If token is not provided
    if (!token) {
      throw new ApiError(401, "Access token not provided");
    }

    console.log(`Token isssss:${token}`);
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

// const verifyTokenMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let token: string | undefined;
//     console.log("s453453fgfdgdfgdf34534");
//     console.log("request headers", req.headers);
//     // Check if token is present in cookies
//     if (req.cookies && req.cookies.accessToken) {
//       token = req.cookies.accessToken;
//     } else if (req.headers.authorization) {
//       // Extract token from Authorization header if not found in cookies
//       const authHeader = req.headers.authorization;
//       if (authHeader.startsWith("Bearer ")) {
//         token = authHeader.slice(7).trim(); // Remove 'Bearer ' prefix
//       }
//     }

//     // If token is not provided
//     if (!token) {
//       throw new Error("Access token not provided");
//     }

//     // Verifying access token
//     const decodeToken = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjI1NjI0YjRjNGQyYjdmZTZiZmZjMmEiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwidXNlck5hbWUiOiJBRG1pbiIsIm5hbWUiOiJrb25hcmsiLCJpYXQiOjE3MTU3OTU3MjUsImV4cCI6MTcxNTc5OTMyNX0.GRvbAh3x2goPE754uIEl3hIN4QYJI-aTxF4XNqMXLOQ', process.env.ACCESS_TOKEN_SECRET);

//     // If token is valid, move to next middleware
//     next();
//   } catch (error: any) {
//     if (error instanceof TokenExpiredError) {
//       // Token has expired
//       return res.status(401).json({ error: "Token Expired" });
//     }

//     // Handling other token verification errors
//     console.error("Token verification failed:", error.message);
//     return res.status(401).json({ error: "Invalid Token" });
//   }
// };

export default verifyTokenMiddleware;
