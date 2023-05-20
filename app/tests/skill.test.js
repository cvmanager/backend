import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import SkillData from './data/skill.data';
import UsersData from './data/user.data';
import i18n from '../middlewares/lang.middleware.js';
import * as path from 'path';
import UserData from './data/user.data';

let token;
let skillData;
let newSkill;
let skill;
let user;
let usersData;
let users;
let skillItem;

prepareDB();
describe("Skill Routes", () => {

    beforeEach(async () => {

        let userData = new UserData();
        token = userData.getAccessToken();

        skillData = new SkillData();
        skill = skillData.getSkill();

        usersData = new UsersData();
        user = usersData.getUser();
    })


    describe('GET /', () => {
        it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/skills?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/skills?page=1&size=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(app)
                .get("/api/V1/skills?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(app)
                .get("/api/V1/skills")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('title')
            expect(data).toHaveProperty('color')
            expect(data).toHaveProperty('icon')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('id')
        })

        it('should get list of skills', async () => {
            const response = await request(app)
                .get("/api/V1/skills")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`POST /`, () => {


        beforeEach(async () => {
            newSkill = {
                "_id": Types.ObjectId(),
                "title": faker.random.alpha(10),
                "color": "323223",
                "icon": faker.random.alpha(50),
                "created_by": user._id,
                "is_active": true
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if title is not send`, async () => {
            delete newSkill.title;
            const response = await request(app)
                .post(`/api/V1/skills`)
                .set(`Authorization`, token)
                .send(newSkill);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if title is grather than 100 character`, async () => {
            newSkill.title = faker.random.alpha(101);
            const response = await request(app)
                .post(`/api/V1/skills`)
                .set(`Authorization`, token)
                .send(newSkill);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.CREATED} if all data correct `, async () => {
            const response = await request(app)
                .post(`/api/V1/skills`)
                .set(`Authorization`, token)
                .send(newSkill);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })
    })

})




