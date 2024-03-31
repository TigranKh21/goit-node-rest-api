import express from "express";
import authController from "../controllers/authController.js";
import validateBody from "../helpers/validateBody.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../schemas/userSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  authController.register
);
authRouter.post("/login", validateBody(loginUserSchema), authController.login);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.put(
  "/",
  authenticate,
  validateBody(updateUserSchema),
  authController.updateSubscript
);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  authController.updateAvatar
);

export default authRouter;
