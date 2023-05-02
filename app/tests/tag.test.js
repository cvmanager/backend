import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data';
import prepareDB from './utils/prepareDB'
import { faker } from '@faker-js/faker';
import TagData from './data/tag.data';

let token;
let user;
let users;
let userData;
let tagData;
let tag;

prepareDB();
describe(`Position Routes`, () => {

    beforeEach(async () => {
        userData = new UserData();
        token = userData.getAccessToken();
        user = userData.getUser();
        users = userData.getUsers();

        tagData = new TagData();
        tag = tagData.getTag();
    })

    describe(`GET /`, () => {

        it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/tags?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/tags?page=1&size=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get no item if name is not find`, async () => {
            const response = await request(app)
                .get(`/api/V1/tags?page=1&size=1&query=no item`)
                .set(`Authorization`, token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it(`should get one item if page = 1 and size = 1`, async () => {
            const response = await request(app)
                .get(`/api/V1/tags?page=1&size=1`)
                .set(`Authorization`, token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it(`should check field of object returned`, async () => {
            const response = await request(app)
                .get(`/api/V1/tags`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty(`_id`)
            expect(data).toHaveProperty(`name`)
            expect(data).toHaveProperty(`color`)
            expect(data).toHaveProperty(`count`)
            expect(data).toHaveProperty(`deleted`)
            expect(data).toHaveProperty(`createdAt`)
            expect(data).toHaveProperty(`updatedAt`)
        })

        it(`should get list of tags`, async () => {
            const response = await request(app)
                .get(`/api/V1/tags`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`POST /`, () => {

        let newTag;
        beforeEach(async () => {
            newTag = {
                'name': faker.random.alpha(10)
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if name is not send`, async () => {
            delete newTag.name;
            const response = await request(app)
                .post(`/api/V1/tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is less than 3 character`, async () => {
            newTag.name = faker.random.alpha(2);
            const response = await request(app)
                .post(`/api/V1/tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is grather than 100 character`, async () => {
            newTag.name = faker.random.alpha(101);
            const response = await request(app)
                .post(`/api/V1/tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.CONFLICT} if tag already exists `, async () => {
            newTag.name = tag.name;
            const response = await request(app)
                .post(`/api/V1/tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        })
        it(`should get ${httpStatus.CREATED} if all data correct `, async () => {
            const response = await request(app)
                .post(`/api/V1/tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })
    })

})
