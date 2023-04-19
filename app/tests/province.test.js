import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'

import prepareDB from './utils/prepareDB'
import UserData from './data/user.data';
import ProvinceData from './data/province.data';
import { Types } from 'mongoose';

let token;
let province;
prepareDB();

describe('Province routes', () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();

        let provinceData = new ProvinceData();
        province = await provinceData.getProvince();
    })

    describe('GET /', () => {

        it('should get no item if name is not find', async () => {
            const response = await request(app)
                .get("/api/V1/provinces?query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data;
            expect(data.length).toBe(0);
        })

        it("should check field of object returned", async () => {
            const response = await request(app)
                .get("/api/V1/provinces")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
        })

        it('should get list of provinces', async () => {
            const response = await request(app)
                .get("/api/V1/provinces")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`GET /:id/cities`, () => {

        it(`should get ${httpStatus.NOT_FOUND} province id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/provinces/${Types.ObjectId()}/cities`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} success if correct`, async () => {
            console.log(province);
            const response = await request(app)
                .get(`/api/V1/provinces/${province._id}/cities`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('province_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('latitude')
            expect(data).toHaveProperty('longitude')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(response.statusCode).toBe(httpStatus.OK)
        })
    })
});

