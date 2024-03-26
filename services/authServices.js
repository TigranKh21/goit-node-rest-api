import User from "../models/User.js";
import bcrypt from "bcrypt";

export const findUser = async (filter) => {
  return User.findOne(filter);
};

export const register = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashedPassword });
};

export const validatePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const updateUser = async (filter, data) => {
  return User.findOneAndUpdate(filter, data);
};
