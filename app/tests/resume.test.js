import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'

import UserData from './data/user.data';

import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import ResumeData from './data/resume.data';
import { faker } from '@faker-js/faker';

import CompanyData from './data/company.data';
import ProjectData from './data/project.data';
import PositionData from './data/position.data';
import UsersData from './data/user.data';


let token;
let resumeItem;
let resume;
let position;
let company;
let project;
let resumeData;
let companyData;
let projectData;
let positionData;
let user;
let usersData;

prepareDB();
describe("Resumes Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();

        resumeData = new ResumeData();
        resume = resumeData.getResume();

        companyData = new CompanyData();
        company = companyData.getCompany();

        projectData = new ProjectData();
        project = projectData.getProject();

        positionData = new PositionData();
        position = positionData.getPosition();

        usersData = new UsersData();
        user = usersData.getUser();
    })

    describe("GET /resumes/{id}/commments", () => {

        it(`should get ${httpStatus.BAD_REQUEST} resume id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/resumes/fakeID/comments`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} resume is not exist `, async () => {
            const response = await request(app)
                .get(`/api/V1/resumes/${Types.ObjectId()}/comments`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} resume dont have any comment `, async () => {
            resumeItem = {
                "_id": Types.ObjectId(),
                "company_id": company._id,
                "project_id": project._id,
                "position_id": position._id,
                "firstname": faker.name.firstName(),
                "lastname": faker.name.lastName(),
                "gender": "men",
                "email": faker.internet.email(),
                "birth_year": "1370",
                "marital_status": "married",
                "military_status": "included",
                "mobile": faker.phone.number('989#########'),
                "residence_city": Types.ObjectId(),
                "work_city": Types.ObjectId(),
                "education": "diploma",
                "created_by": user._id
            }
            resumeData.addResume([resumeItem])
            const response = await request(app)
                .get(`/api/V1/resumes/${resumeItem._id}/comments`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
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

    describe("POST /resumes/{id}/commments", () => {
        let data = {
            'body': faker.random.alpha(50),
        }

        it(`should get ${httpStatus.BAD_REQUEST} resume id is not a mongo id`, async () => {
            data.body = 'test text';
            const response = await request(app)
                .post(`/api/V1/resumes/fakeID/comments`,)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} resume is not exist `, async () => {
            const response = await request(app)
                .post(`/api/V1/resumes/${Types.ObjectId()}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} body text is empty `, async () => {
            data.body = '';
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} body text is not send `, async () => {
            delete data.body;
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} body text is less than 5 character `, async () => {
            data.body = faker.random.alpha(4);
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST}body text is more than 1000 character `, async () => {
            data.body = faker.random.alpha(1001);
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should check field of object returned`, async () => {
            data.body = faker.random.alpha(50);
            const response = await request(app)
                .post(`/api/V1/resumes/${resume._id}/comments`)
                .set(`Authorization`, token)
                .send(data);

            let dataResponce = response.body.data[0];
            expect(dataResponce).toHaveProperty(`_id`)
            expect(dataResponce).toHaveProperty(`resume_id`)
            expect(dataResponce).toHaveProperty(`body`)
            expect(dataResponce).toHaveProperty(`created_by`)
            expect(dataResponce).toHaveProperty(`createdAt`)
            expect(dataResponce).toHaveProperty(`deleted`)
            expect(dataResponce).toHaveProperty(`createdAt`)
            expect(dataResponce).toHaveProperty(`updatedAt`)
        })
    })

})
