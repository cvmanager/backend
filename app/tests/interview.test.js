import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data';
import CompanyData from './data/company.data';
import ProjectData from './data/project.data';
import ManagerData from './data/manager.data';
import InterviewData from './data/interview.data';
import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import ResumeData from './data/resume.data';
import PositionData from './data/position.data';
import i18n from '../middlewares/lang.middleware.js';

let token;
let company;
let project;
let manager;
let userData;
let user;
let projectData;
let resumeData;
let resume;
let interview;
let interviewData;

prepareDB();
describe("Interview Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();

        resumeData = new ResumeData();
        resume = resumeData.getResume();

        userData = new UserData();
        user = userData.getUser();

        interviewData = new InterviewData();
        interview = interviewData.getInterview();
    })

    describe('GET /', () => {
        it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
            const response = await request(app)
                .get("/api/v1/interviews?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get("/api/v1/interviews?page=1&size=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it('should get no item if name is not find', async () => {
            const response = await request(app)
                .get("/api/v1/interviews?page=1&size=1&query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(app)
                .get("/api/v1/interviews?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(app)
                .get("/api/v1/interviews")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty("_id");
            expect(data).toHaveProperty("resume_id");
            expect(data).toHaveProperty("event_time");
            expect(data).toHaveProperty("event_type");
            expect(data).toHaveProperty("status");
            expect(data).toHaveProperty("type");
            expect(data).toHaveProperty("description");
            expect(data).toHaveProperty("contribution");
            expect(data).toHaveProperty("created_by");
            expect(data).toHaveProperty("deleted");
            expect(data).toHaveProperty("createdAt");
            expect(data).toHaveProperty("updatedAt");
            expect(data).toHaveProperty("id");
        })

        it('should get list of resumes', async () => {
            const response = await request(app)
                .get("/api/v1/interviews")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`GET /:id`, () => {

        it(`should get ${httpStatus.BAD_REQUEST} interview id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/interviews/fakeID`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} interview id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/interviews/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} success if correct`, async () => {
            const response = await request(app)
                .get(`/api/V1/interviews/${interview._id}`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty("_id");
            expect(data).toHaveProperty("resume_id");
            expect(data).toHaveProperty("event_time");
            expect(data).toHaveProperty("event_type");
            expect(data).toHaveProperty("status");
            expect(data).toHaveProperty("type");
            expect(data).toHaveProperty("description");
            expect(data).toHaveProperty("contribution");
            expect(data).toHaveProperty("created_by");
            expect(data).toHaveProperty("deleted");
            expect(data).toHaveProperty("createdAt");
            expect(data).toHaveProperty("updatedAt");
            expect(data).toHaveProperty("id");
            expect(response.statusCode).toBe(httpStatus.OK)
        })
    })

    describe(`DELETE /:id`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} if interview id is not valid`, async () => {
            const response = await request(app)
                .delete(`/api/V1/interviews/fakeId`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if interview not found `, async () => {
            const response = await request(app)
                .delete(`/api/V1/interviews/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .delete(`/api/V1/interviews/${interview._id}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`POST /`, () => {

        let newInterview;
        beforeEach(async () => {
            newInterview = {
                "_id": Types.ObjectId(),
                "resume_id": resume._id,
                "event_time": "2022-09-21",
                "event_type": "online",
                "type": "person",
                'created_by': user._id,
                "description": null,
                "contribution": [],
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume_id is not send`, async () => {
            delete newInterview.resume_id;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_time is not send`, async () => {
            delete newInterview.event_time;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_type is not send`, async () => {
            delete newInterview.event_type;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume_id is not valid`, async () => {
            newInterview.resume_id = 'fakeresume_id';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_time is not valid`, async () => {
            newInterview.event_time = '2022-09-50';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_time is before now`, async () => {
            newInterview.event_time = '2021-01-01';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_time bigger than next year`, async () => {
            newInterview.event_time = '2025-01-01';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_type is not valid`, async () => {
            newInterview.event_type = 'fakeeventtime';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if status is not valid`, async () => {
            newInterview.status = 'fakestatus';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if type is not valid`, async () => {
            newInterview.type = 'faketype';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is short`, async () => {
            newInterview.description = faker.random.alpha(1);
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is long`, async () => {
            newInterview.description = faker.random.alpha(513);
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if contribution is not array`, async () => {
            newInterview.contribution = "must be array";
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.CREATED} if all data correct `, async () => {
            const response = await request(app)
                .post(`/api/V1/interviews`)
                .set(`Authorization`, token)
                .send(newInterview);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })

    })

    describe(`PATCH /:id`, () => {

        let updateInterview;
        beforeEach(async () => {
            updateInterview = {
                "_id": Types.ObjectId(),
                "resume_id": resume._id,
                "event_time": "2022-09-21",
                "event_type": "online",
                "status": "pending",
                "result": "pending",
                "type": "person",
                'created_by': user._id,
                "description": null,
                "contribution": [],
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if interview id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/interviews/fakeId`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if status is not send`, async () => {
            delete updateInterview.status;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is not send`, async () => {
            delete updateInterview.result;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if resume_id is not valid`, async () => {
            updateInterview.resume_id = 'fakeresume_id';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_time is not valid`, async () => {
            updateInterview.event_time = '2022-09-50';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_time is not valid`, async () => {
            updateInterview.event_time = '2022-09-50';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_type is not valid`, async () => {
            updateInterview.event_type = 'fakeeventtime';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if event_type is not valid`, async () => {
            updateInterview.event_type = 'fakeeventtime';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if status is not valid`, async () => {
            updateInterview.status = 'fakestatus';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if type is not valid`, async () => {
            updateInterview.type = 'faketype';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is short`, async () => {
            updateInterview.description = faker.random.alpha(1);
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is long`, async () => {
            updateInterview.description = faker.random.alpha(513);
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if contribution is not array`, async () => {
            updateInterview.contribution = "must be array";
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(updateInterview);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
    })
})
