import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'

import UserData from './data/user.data';

import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import ResumeData from './data/resume.data';


let token;
let resume;

prepareDB();
describe("Company Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();

        let resumeData = new ResumeData();
        resume = resumeData.getResume();
    })

    describe("GET /resumes/{id}/commments", () => {

        it(`should get ${httpStatus.BAD_REQUEST} resume id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/resumes/fakeID/comments`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} resume is not exist `, async () => {
            const response = await request(app)
                .get(`/api/V1/resumes/${Types.ObjectId()}/comments`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })


        it(`should check field of object returned`, async () => {
            const response = await request(app)
                .get(`/api/V1/resumes/${resume._id}/comments`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty(`_id`)
            expect(data).toHaveProperty(`resume_id`)
            expect(data).toHaveProperty(`body`)
            expect(data).toHaveProperty(`created_by`)
            expect(data).toHaveProperty(`createdAt`)
            expect(data).toHaveProperty(`deleted`)
            expect(data).toHaveProperty(`createdAt`)
            expect(data).toHaveProperty(`updatedAt`)
        })


    })



})
