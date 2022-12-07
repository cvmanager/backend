import httpStatus from 'http-status'
import request from 'supertest'
import { userOne, insertUsers, accessToken } from './fixtures/user.fixture.js'
import setupTestDB from './utils/setupTestDB.js';
import env from '../helper/env.js';

let baseURL = env("TEST_BASE_URL")
setupTestDB();

describe('Constant routes', () => {

    let token;
    beforeEach(async () => {
        await insertUsers([userOne]);
        token = 'Bearer ' + await accessToken(userOne);
    })

    describe('GET /', () => {

        it('should get ' + httpStatus.INTERNAL_SERVER_ERROR + ' error if page is not number', async () => {
            const response = await request(baseURL)
                .get("/provinces?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
        })

        it('should get ' + httpStatus.OK + ' success if size sting and return empty', async () => {
            const response = await request(baseURL)
                .get("/provinces?page=1&size=string")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;

            expect(data.length).toBe(0);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

        it('should get no item if name is not find', async () => {
            const response = await request(baseURL)
                .get("/provinces?page=1&size=1&query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(baseURL)
                .get("/provinces?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(baseURL)
                .get("/provinces")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('cities')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
        })

        it('should get list of province', async () => {
            const response = await request(baseURL)
                .get("/provinces")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })
});

