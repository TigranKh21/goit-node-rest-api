import express from "express";
import authController from "../controllers/authController.js";
import validateBody from "../helpers/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../schemas/userSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  authController.register
);
authRouter.post("/login", validateBody(loginUserSchema), authController.login);

export default authRouter;
