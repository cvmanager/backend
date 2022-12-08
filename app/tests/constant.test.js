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

        it("should check field of object returned", async () => {
            const response = await request(baseURL)
                .get("/constant")
                .set('Authorization', token)

            let data = response.body.data[0];
            expect(data).toHaveProperty('gender')
            expect(data).toHaveProperty('marital_status')
            expect(data).toHaveProperty('education')
            expect(data).toHaveProperty('military_status')
            expect(data).toHaveProperty('resume_status')
        })

        it('should get list of constant', async () => {
            const response = await request(baseURL)
                .get("/constant")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toEqual(httpStatus.OK);
        })

    })
});

