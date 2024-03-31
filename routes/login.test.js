import app from "../app.js";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";

const { DB_HOST, PORT, JWT_SECRET } = process.env;

describe("Test login", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("Login with valid data", async () => {
    const loginData = {
      email: "tigran12@gmail.com",
      password: "Tigran2003",
    };

    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);
    const token = jwt.sign({ id: body.id }, JWT_SECRET, { expiresIn: "23h" });
    expect(statusCode).toBe(200);
    expect(body.token).toBe(token);
  });

  test("Login with incorrect email", async () => {
    const loginData = {
      email: "tigran1@gmail.com",
      password: "Tigran2003",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);
    expect(statusCode).toBe(401);
    expect(body.message).toBe("Email or password is wrong");
  });
});
