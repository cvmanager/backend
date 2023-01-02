import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data';
import setupTestDB from './utils/setupTestDB'

let token;

setupTestDB();
describe(`Position Routes`, () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();
    })

    describe(`GET /`, () => {

        it(`should get ${httpStatus.INTERNAL_SERVER_ERROR} error if page is not number`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions?page=string`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
        })

        it(`should get ${httpStatus.OK} success if size sting and return empty`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions?page=1&size=string`)
                .set(`Authorization`, token)
                .send();
            let data = response.body.data[0].docs;

            expect(data.length).toBe(0);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

        it(`should get no item if name is not find`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions?page=1&size=1&query=no item`)
                .set(`Authorization`, token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it(`should get one item if page = 1 and size = 1`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions?page=1&size=1`)
                .set(`Authorization`, token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it(`should check field of object returned`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty(`_id`)
            expect(data).toHaveProperty(`project_id`)
            expect(data).toHaveProperty(`company_id`)
            expect(data).toHaveProperty(`title`)
            expect(data).toHaveProperty(`level`)
            expect(data).toHaveProperty(`is_active`)
            expect(data).toHaveProperty(`deleted`)
            expect(data).toHaveProperty(`createdAt`)
            expect(data).toHaveProperty(`updatedAt`)
        })

        it(`should get list of positions`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })
})
