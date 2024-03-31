import jwt from "jsonwebtoken";
import "dotenv/config";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

import * as authServices from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" }, true);
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServices.register({ ...req.body, avatarURL });
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparePassword = await authServices.validatePassword(
    password,
    user.password
  );
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.updateUser({ _id: id }, { token });
  res.json({ token, id });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });
  res.json({
    message: "No Content",
  });
};

const updateSubscript = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await authServices.updateUser({ _id }, { subscription });
  res.json({
    message: "Subscription updated successfully",
  });
};

const updateAvatar = async (req, res) => {
  const { _id: id } = req.user;
  const avatarPath = path.resolve("public", "avatars");
  const { path: oldPath, filename } = req.file;

  Jimp.read(oldPath)
    .then((image) => {
      image.resize(250, 250).writeAsync(oldPath);
    })
    .then(async () => {
      const newPath = path.join(avatarPath, filename);
      await fs.rename(oldPath, newPath);
      const avatarURL = `/avatars/${filename}`;

      const user = await authServices.updateUser({ _id: id }, { avatarURL });
      res.status(201).json({ avatarURL: user.avatarURL });
    })
    .catch((err) => {
      console.error(err);
    });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscript: ctrlWrapper(updateSubscript),
  updateAvatar: ctrlWrapper(updateAvatar),
};
