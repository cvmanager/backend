import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'

import prepareDB from './utils/prepareDB'
import UserData from './data/user.data';
import CityData from './data/city.data';
import { Types } from 'mongoose';

let token;
let city;
prepareDB();

describe('City routes', () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();

        let cityData = new CityData();
        city = await cityData.getCity();
    })

    describe('GET /', () => {

        it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/cities?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/cities?page=1&size=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it('should get no item if name is not find', async () => {
            const response = await request(app)
                .get("/api/V1/cities?page=1&size=1&query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(app)
                .get("/api/V1/cities?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(app)
                .get("/api/V1/cities")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
        })

        it('should get list of cities', async () => {
            const response = await request(app)
                .get("/api/V1/cities")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`GET /:id`, () => {

        it(`should get ${httpStatus.BAD_REQUEST} city id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/cities/fakeID`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} city id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/cities/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
                console.log(response.body)
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} success if correct`, async () => {
            const response = await request(app)
                .get(`/api/V1/cities/${city._id}`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty(`_id`)
            expect(data).toHaveProperty(`province_id`)
            expect(data).toHaveProperty(`name`)
            expect(data).toHaveProperty(`latitude`)
            expect(data).toHaveProperty(`longitude`)
            expect(data).toHaveProperty(`deleted`)
            expect(data).toHaveProperty(`createdAt`)
            expect(data).toHaveProperty(`updatedAt`)
            expect(response.statusCode).toBe(httpStatus.OK)
        })
    })
});

