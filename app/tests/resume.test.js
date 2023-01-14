import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data';
import ResumeData from './data/resume.data';
import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';

let token;
let resume;
let users;
let user;
let resumeData;

prepareDB();
describe("Resume Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();
        users = userData.getUsers();
        user = userData.getUser();

        let resumeData = new ResumeData();
        resume = resumeData.getResume();

    })

    describe(`POST /:id/call-history`, () => {

        let callHistory;
        beforeEach(async () => {
            callHistory = {
                '_id': Types.ObjectId(),
                'result': 'answered',
                'calling_date': faker.date.recent(),
                'description': faker.random.alpha(10),
                'created_by': user._id,
                'recall_at': faker.date.future(1)
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not MongoId`, async () => {
            const response = await request(app)
                .post(`/api/V1/resumes/fakeId/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if resume id is not valid`, async () => {
            let invalidResumeId = Types.ObjectId();
            const response = await request(app)
                .post(`/api/V1/resumes/${invalidResumeId}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is not send`, async () => {
            delete callHistory.result
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is not enum`, async () => {
            callHistory.result = 'fakeResult'
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if calling_date is not send`, async () => {
            delete callHistory.calling_date
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if calling_date is not date`, async () => {
            callHistory.calling_date = 'fakeDate';
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is grather than 1000 character`, async () => {
            callHistory.description = faker.random.alpha(1001);
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if result is recall and recall_at not send`, async () => {
            callHistory.result = 'recall'
            delete callHistory.recall_at;
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is recall and recall_at is not date`, async () => {
            callHistory.result = 'recall'
            callHistory.recall_at = 'invalidDate';
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is recall and recall_at is in the past`, async () => {
            callHistory.result = 'recall'
            callHistory.recall_at = faker.date.past(10);
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

})
