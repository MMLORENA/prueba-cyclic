import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "..";
import connectDB from "../../database";
import { UserRegister } from "../../interfaces/interfaces";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();

  await connectDB(mongoURL);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given the endpoint POST /user/register", () => {
  const register = "/user/register";

  describe("When it receives a request with name 'Mar', firstName 'Zas', username 'MarZas' and password '12345'", () => {
    test("Then it should response with status '201' and a message 'User Created'", async () => {
      const message = "User Created";
      const mockUser: UserRegister = {
        name: "Mar",
        firstName: "Zas",
        userName: "MarZas",
        password: "12345",
      };
      const { body } = await request(app)
        .post(register)
        .send(mockUser)
        .expect(201);

      expect(body).toHaveProperty("message", message);
    });
  });

  describe("When it receives a request without password", () => {
    test("Then it should respond iwth status 400 and a message 'Wrong Data'", async () => {
      const message = "Wrong data";
      const mockUserWrong = {
        name: "Mar",
        firstName: "Zas",
        userName: "MarZas",
      };

      const { body } = await request(app)
        .post(register)
        .send(mockUserWrong)
        .expect(400);

      expect(body).toHaveProperty("error", message);
    });
  });
});
