import express from "express";
import {
  login,
  signup,
  logout,
  refreshToken,
} from "../controller/auth.controller.ts";
import loginValidationRules from "../rules/login.validation.rules.ts";
import signupValidationRules from "../rules/signup.validation.rules.ts";
import verifyTokenMiddleware from "../middleware/verifyToken.ts";

const router = express.Router();

// Route to handle user login
router.post("/login", loginValidationRules, login);

// Route to handle user signup
router.post("/signup", signupValidationRules, signup);

// Route to handle user logout
router.post("/logout", logout);

// Route to refresh access token
router.post("/token/refresh", refreshToken);

export default router;
