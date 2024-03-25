import jwt from "jsonwebtoken";
import "dotenv/config";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

import * as authServices from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServices.register(req.body);
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  console.log(user);
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparePassword = authServices.validatePassord(user.password, password);
  if (!comparePassword) {
    console.log("and now is here");
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  res.json({ token });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
