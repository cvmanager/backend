import httpStatus from 'http-status'
import request from 'supertest'
import env from '../helper/env.js';
import app from '../app.js'
import AllInit from './init/all.init';

import UserData from './data/user.data';
import ManagerData from './data/manager.data';

import setupTestDB from './utils/setupTestDB'
import { Types } from 'mongoose';
import CompanyData from './data/company.data';

let server;
let token;
let company;
let manager;
let users;

setupTestDB();
describe("Company Routes", () => {

    beforeEach(() => {
        server = app.listen(env('PORT'));
        let allInit = new AllInit();
        allInit.setData();

        let userData = new UserData();
        token = userData.getAccessToken();
        users = userData.getUsers();

        let companyData = new CompanyData();
        company = companyData.getCompany();

        let managerData = new ManagerData();
        manager = managerData.getManager();

    })

    afterEach(async () => {
        server.close();
    })

    describe('GET /companies', () => {
        it('should get ' + httpStatus.OK + ' error if page is not number', async () => {
            const response = await request(app)
                .get("/api/V1/companies?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

        it('should get ' + httpStatus.OK + ' success if size sting and return empty', async () => {
            const response = await request(app)
                .get("/api/V1/companies?page=1&size=string")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;

            expect(data.length).toBe(0);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

        it('should get no item if name is not find', async () => {
            const response = await request(app)
                .get("/api/V1/companies?page=1&size=1&query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(app)
                .get("/api/V1/companies?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(app)
                .get("/api/V1/companies")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            console.log(data)
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('logo')
            expect(data).toHaveProperty('is_active')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
        })

        it('should get list of companies', async () => {
            const response = await request(app)
                .get("/api/V1/companies")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })
 
})
