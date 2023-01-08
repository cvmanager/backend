import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import request from "supertest";
import app from "../app.js";
import UserData from "./data/user.data";
import prepareDB from "./utils/prepareDB";

let token;
let users;

prepareDB();
describe("User Routes", () => {

  beforeEach(async () => {
    let userData = new UserData();
    token = userData.getAccessToken();
    users = userData.getUsers();
  });


  describe("POST /auth", () => {

    let authData;
    beforeEach(() => {
      authData = {
        'username': 'test',
      };
    })

    it(`should get ${httpStatus.OK} username exist`, async () => {
      authData.username = users[0].username
      const response = await request(app)
        .post("/api/V1/auth/check-username")
        .set("Authorization", token)
        .send(authData);

      expect(response.statusCode).toBe(httpStatus.OK);
    });

    it(`should get ${httpStatus.NOT_FOUND} username not found`, async () => {
      authData.username = faker.internet.userName()
      const response = await request(app)
        .post("/api/V1/auth/check-username")
        .set("Authorization", token)
        .send(authData);

      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    it(`should get ${httpStatus.NOT_FOUND} username not send`, async () => {
      delete authData.username
      const response = await request(app)
        .post("/api/V1/auth/check-username")
        .set("Authorization", token)
        .send(authData);

      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });

  });


});
