import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data';
import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';

let token;
let users;
let user;
let userData;

prepareDB();
describe("Auth Routes", () => {

    beforeEach(async () => {
        userData = new UserData();
        token = userData.getAccessToken();
        users = userData.getUsers();
        user = userData.getUser();
    });


    describe("POST /auth/check-username", () => {

        let authData;
        beforeEach(() => {
            authData = {
                'username': 'test',
            };
        })

        it(`should get ${httpStatus.BAD_REQUEST} username not send`, async () => {
            delete authData.username
            const response = await request(app)
                .post("/api/V1/auth/username-isavailable")
                .set("Authorization", token)
                .send(authData);

            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });


        it(`should get ${httpStatus.BAD_REQUEST} username is already exist`, async () => {
            authData.username = users[0].username
            const response = await request(app)
                .post("/api/V1/auth/username-isavailable")
                .set("Authorization", token)
                .send(authData);

            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });


        it(`should get ${httpStatus.OK} username not found and available`, async () => {
            authData.username = faker.internet.userName()
            const response = await request(app)
                .post("/api/V1/auth/username-isavailable")
                .set("Authorization", token)
                .send(authData);

            expect(response.statusCode).toBe(httpStatus.OK);
        });

    });


    describe(`POST /signup`, () => {

        let newUser;
        beforeEach(async () => {
            newUser = {
                "_id": Types.ObjectId(),
                "firstname": faker.name.firstName(),
                "lastname": faker.name.lastName(),
                "username": faker.random.alpha(9),
                "mobile": faker.phone.number('9891########'),
                "password": '123456789'
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if firstname is not send`, async () => {
            delete newUser.firstname;
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if firstname is less than 3 character`, async () => {
            newUser.firstname = faker.random.alpha(2);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if firstname is grather than 80 character`, async () => {
            newUser.firstname = faker.random.alpha(81);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if lastname is not send`, async () => {
            delete newUser.lastname;
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if lastname is less than 3 character`, async () => {
            newUser.lastname = faker.random.alpha(2);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if lastname is grather than 80 character`, async () => {
            newUser.lastname = faker.random.alpha(81);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if mobile is not send`, async () => {
            delete newUser.mobile;
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if mobile has wrong format`, async () => {
            newUser.mobile = faker.random.alpha(12);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if username is not send`, async () => {
            delete newUser.username;
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if username is less than 5 character`, async () => {
            newUser.username = faker.random.alpha(4);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if username is grather than 10 character`, async () => {
            newUser.username = faker.random.alpha(11);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if password is not send`, async () => {
            delete newUser.password;
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if password is less than 3 character`, async () => {
            newUser.password = faker.random.alpha(7);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if password is grather than 80 character`, async () => {
            newUser.password = faker.random.alpha(11);
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if user mobile is already exists`, async () => {
            newUser.mobile = user.mobile;
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if username is already exists`, async () => {
            newUser.username = user.username;
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.CREATED} if all data is correct`, async () => {
            const response = await request(app)
                .post(`/api/V1/auth/signup`)
                .send(newUser);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })
    })

    describe(`POST /login`, () => {

        let loginUser;
        beforeEach(async () => {
            loginUser = {
                "mobile": user.mobile,
                "password": '12345678'
            }
        })
        it(`should get ${httpStatus.BAD_REQUEST} if mobile and username is not send`, async () => {
            delete loginUser.mobile;
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if mobile number has wromg format`, async () => {
            loginUser.mobile = faker.random.alpha(12);
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if username is less than 5 character`, async () => {
            loginUser.mobile = faker.random.alpha(4);
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if username is grather than 10 character`, async () => {
            loginUser.mobile = faker.random.alpha(11);
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if password is not send`, async () => {
            delete loginUser.password;
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if password is less than 3 character`, async () => {
            loginUser.password = faker.random.alpha(7);
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if password is grather than 80 character`, async () => {
            loginUser.password = faker.random.alpha(11);
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if user is not found`, async () => {
            loginUser.mobile = faker.phone.number('989#########');
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if password is wrong`, async () => {
            loginUser.password = '987654321';
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if user is banned`, async () => {
            let newUserIsBanned = {
                "_id": Types.ObjectId(),
                "firstname": faker.name.firstName(),
                "lastname": faker.name.lastName(),
                "username": faker.internet.userName(),
                "mobile": faker.phone.number('9891########'),
                "is_banned": true,
                "password": '123456789'
            }
            userData.setUsers([newUserIsBanned]);
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(newUserIsBanned);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if user is loged in with mobile`, async () => {
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
        it(`should get ${httpStatus.OK} if user is loged in with username`, async () => {
            loginUser.mobile = user.username;
            const response = await request(app)
                .post(`/api/V1/auth/login`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`POST /verify-token`, () => {
        let loginUser;
        beforeEach(async () => {
            loginUser = {
                "mobile": user.mobile,
                "password": '12345678'
            }
        })
        it(`should get ${httpStatus.BAD_REQUEST} if token is not send`, async () => {
            const response = await request(app)
                .post(`/api/V1/auth/verify-token`)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if token is verified`, async () => {
            const response = await request(app)
                .post(`/api/V1/auth/verify-token`)
                .set('Authorization', token)
                .send(loginUser);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })


});
