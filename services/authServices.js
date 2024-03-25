import User from "../models/User.js";
import bcrypt from "bcrypt";

export const findUser = async (filter) => {
  return User.findOne(filter);
};

export const register = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashedPassword });
};

export const login = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
};

export const validatePassord = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
