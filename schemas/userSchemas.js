import Joi from "joi";
import { email_mask } from "../constants/user-constants.js";

export const registerUserSchema = Joi.object({
  email: Joi.string().pattern(email_mask).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
  token: Joi.string(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(email_mask).required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
  avatarURL: Joi.string(),
});

export const emailUserSchema = Joi.object({
  email: Joi.string().pattern(email_mask).required(),
});
