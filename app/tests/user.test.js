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


  describe("GET /users", () => {
    it(`should get ${httpStatus.OK} list returned`, async () => {
      const response = await request(app)
        .get("/api/V1/users")
        .set("Authorization", token)
        .send();
      expect(response.statusCode).toBe(httpStatus.OK);
    });

    it(`should return no item`, async () => {
      const response = await request(app)
        .get("/api/V1/users?q=therisnoitem")
        .set("Authorization", token)
        .send();
      const data = response.body.data[0].docs;
      expect(data.length).toBe(0);
    });

    it(`should return just one item`, async () => {
      const response = await request(app)
        .get("/api/V1/users?page=1&size=1")
        .set("Authorization", token)
        .send();
      const data = response.body.data[0].docs;
      expect(data.length).toBe(1);
    });

    it(`will check properties and should return results with expected properties`, async () => {
      const response = await request(app)
        .get("/api/V1/users")
        .set("Authorization", token)
        .send();
      const data = response.body.data[0].docs[0];

      expect(data).toHaveProperty('_id')
      expect(data).toHaveProperty('firstname')
      expect(data).toHaveProperty('lastname')
      expect(data).toHaveProperty('mobile')
      expect(data).toHaveProperty('email')
      expect(data).toHaveProperty('mobile_verified_at')
      expect(data).toHaveProperty('avatar')
      expect(data).toHaveProperty('is_banned')
      expect(data).toHaveProperty('banned_by')
      expect(data).toHaveProperty('banned_at')
      expect(data).toHaveProperty('deleted')
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')
      expect(data).toHaveProperty('id')
    });
  });
});
