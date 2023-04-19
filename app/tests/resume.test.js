import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'

import UserData from './data/user.data';

import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import ResumeData from './data/resume.data';
import { faker } from '@faker-js/faker';

import TagData from './data/tag.data';
import CompanyData from './data/company.data';
import ProjectData from './data/project.data';
import PositionData from './data/position.data';
import UsersData from './data/user.data';
import i18n from '../middlewares/lang.middleware.js';
import * as path from 'path';

let token;
let resumeItem;
let resume;
let position;
let company;
let project;
let tagData;
let tag;
let resumeData;
let companyData;
let projectData;
let positionData;
let user;
let usersData;
let users;
let positionItem;
let companyItem;

prepareDB();
describe("Resumes Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();

        resumeData = new ResumeData();
        resume = resumeData.getResume();

        tagData = new TagData();
        tag = tagData.getTag();

        companyData = new CompanyData();
        company = companyData.getCompany();

        projectData = new ProjectData();
        project = projectData.getProject();

        positionData = new PositionData();
        position = positionData.getPosition();

        usersData = new UsersData();
        user = usersData.getUser();
        users = userData.getUsers();

    })


    describe('GET /', () => {
        it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/resumes?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/resumes?page=1&size=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it('should get no item if name is not find', async () => {
            const response = await request(app)
                .get("/api/V1/resumes?page=1&size=1&query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(app)
                .get("/api/V1/resumes?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(app)
                .get("/api/V1/resumes")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('company_id')
            expect(data).toHaveProperty('project_id')
            expect(data).toHaveProperty('position_id')
            expect(data).toHaveProperty('firstname')
            expect(data).toHaveProperty('lastname')
            expect(data).toHaveProperty('gender')
            expect(data).toHaveProperty('email')
            expect(data).toHaveProperty('birth_year')
            expect(data).toHaveProperty('marital_status')
            expect(data).toHaveProperty('status')
            expect(data).toHaveProperty('mobile')
            expect(data).toHaveProperty('residence_city')
            expect(data).toHaveProperty('work_city')
            expect(data).toHaveProperty('education')
            expect(data).toHaveProperty('phone')
            expect(data).toHaveProperty('min_salary')
            expect(data).toHaveProperty('max_salary')
            expect(data).toHaveProperty('work_experience')
            expect(data).toHaveProperty('military_status')
            expect(data).toHaveProperty('status_updated_at')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('status_history')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
        })

        it('should get list of resumes', async () => {
            const response = await request(app)
                .get("/api/V1/resumes")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`GET /:id`, () => {

        it(`should get ${httpStatus.BAD_REQUEST} resume id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/resumes/fakeID`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} resume id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/resumes/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} success if correct`, async () => {
            const response = await request(app)
                .get(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('company_id')
            expect(data).toHaveProperty('project_id')
            expect(data).toHaveProperty('position_id')
            expect(data).toHaveProperty('firstname')
            expect(data).toHaveProperty('lastname')
            expect(data).toHaveProperty('gender')
            expect(data).toHaveProperty('email')
            expect(data).toHaveProperty('birth_year')
            expect(data).toHaveProperty('marital_status')
            expect(data).toHaveProperty('status')
            expect(data).toHaveProperty('mobile')
            expect(data).toHaveProperty('residence_city')
            expect(data).toHaveProperty('work_city')
            expect(data).toHaveProperty('education')
            expect(data).toHaveProperty('phone')
            expect(data).toHaveProperty('min_salary')
            expect(data).toHaveProperty('max_salary')
            expect(data).toHaveProperty('work_experience')
            expect(data).toHaveProperty('military_status')
            expect(data).toHaveProperty('status_updated_at')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('status_history')
            expect(data).toHaveProperty('summary_count')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(response.statusCode).toBe(httpStatus.OK)
        })
    })

    describe(`POST /`, () => {

        let newResume;
        beforeEach(async () => {
            newResume = {
                "_id": Types.ObjectId(),
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
                "phone": faker.phone.number('989#########'),
                "min_salary": 100000,
                "max_salary": 100000,
                "work_experience": 4,
                "education": "diploma",
                "created_by": user._id
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if company is_active is false`, async () => {
            companyItem = {
                "_id": Types.ObjectId(),
                "is_active": false,
                "created_by": Types.ObjectId(),
                "name": faker.company.name(),
                "description": faker.random.alpha(50),
                "phone": faker.phone.number('989#########'),
                "address": faker.random.alpha(100),
            };
            companyData.addCompany(companyItem)
            positionItem = {
                "_id": Types.ObjectId(),
                "company_id": companyItem._id,
                "project_id": Types.ObjectId(),
                "title": faker.random.alpha(15),
                "level": "mid",
                "description": faker.random.alpha(50),
                "created_by": Types.ObjectId(),
                "is_active": false,
            };
            positionData.addPosition(positionItem)

            newResume.position_id = positionItem._id;

            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if position id is not send`, async () => {
            delete newResume.position_id;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if position id is not mongo id`, async () => {
            newResume.position_id = 'fakeId';
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if position is not found`, async () => {
            newResume.position_id = Types.ObjectId();
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if firstname is not send`, async () => {
            delete newResume.firstname;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if firstname is less than 3 character`, async () => {
            newResume.firstname = faker.random.alpha(2);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if firstname is grather than 50 character`, async () => {
            newResume.firstname = faker.random.alpha(51);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if lastname is not send`, async () => {
            delete newResume.lastname;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if lastname is less than 3 character`, async () => {
            newResume.lastname = faker.random.alpha(2);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if lastname is grather than 50 character`, async () => {
            newResume.lastname = faker.random.alpha(51);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if gender is not send`, async () => {
            delete newResume.gender;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if gender is not in ${i18n.__("system.enums.gender")}`, async () => {
            newResume.gender = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if email is not send`, async () => {
            delete newResume.email;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if email is not valid email`, async () => {
            newResume.email = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if birth_year is not send`, async () => {
            delete newResume.birth_year;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if birth_year is not number`, async () => {
            newResume.birth_year = faker.random.alpha(4);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if birth_year is less than 4 character`, async () => {
            newResume.birth_year = 123;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if birth_year is grather than 4 character`, async () => {
            newResume.birth_year = 12345;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if marital_status is not send`, async () => {
            delete newResume.marital_status;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if marital_status is not in ${i18n.__("system.enums.marital_status")}`, async () => {
            newResume.marital_status = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if mobile is not send`, async () => {
            delete newResume.mobile;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if mobile is not valid mobile`, async () => {
            newResume.mobile = faker.random.alpha(9);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if residence city id is not send`, async () => {
            delete newResume.residence_city;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if residence city id is not mongo id`, async () => {
            newResume.residence_city = 'fakeId';
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if work city id is not send`, async () => {
            delete newResume.work_city;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if work city id is not mongo id`, async () => {
            newResume.work_city = 'fakeId';
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if phone is not send`, async () => {
            newResume.phone = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if phone is less than 9 character`, async () => {
            newResume.phone = faker.phone.number('98######');
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if phone is grather than 12 character`, async () => {
            newResume.phone = faker.phone.number('98###########');
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if min_salary is not send`, async () => {
            newResume.min_salary = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if min_salary is less than 0 character`, async () => {
            newResume.min_salary = -10;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if min_salary is grather than 1000000000 character`, async () => {
            newResume.min_salary = 1000000000000;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if max_salary is not send`, async () => {
            newResume.max_salary = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if max_salary is less than 0 character`, async () => {
            newResume.max_salary = -10;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if max_salary is grather than 1000000000 character`, async () => {
            newResume.max_salary = 1000000000000;
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if work_experience is not send`, async () => {
            newResume.work_experience = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if gender is men and military_status is not in ${i18n.__("system.enums.military_status")}`, async () => {
            newResume.gender = 'men'
            newResume.military_status = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.CREATED} if all data correct `, async () => {
            const response = await request(app)
                .post(`/api/V1/resumes`)
                .set(`Authorization`, token)
                .send(newResume);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })
    })

    describe(`PATCH /:id`, () => {

        let updateResume;
        beforeEach(async () => {
            updateResume = {
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
                "phone": faker.phone.number('989#########'),
                "min_salary": 100000,
                "max_salary": 100000,
                "work_experience": 4,
                "education": "diploma",
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if resumes is not exists`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if firstname is less than 3 character`, async () => {
            updateResume.firstname = faker.random.alpha(2);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if firstname is grather than 50 character`, async () => {
            updateResume.firstname = faker.random.alpha(51);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if lastname is less than 3 character`, async () => {
            updateResume.lastname = faker.random.alpha(2);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if lastname is grather than 50 character`, async () => {
            updateResume.lastname = faker.random.alpha(51);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if gender is not in ${i18n.__("system.enums.gender")}`, async () => {
            updateResume.gender = faker.random.alpha(5);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if email is not valid email`, async () => {
            updateResume.email = faker.random.alpha(5);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if birth_year is not number`, async () => {
            updateResume.birth_year = faker.random.alpha(4);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if birth_year is less than 4 character`, async () => {
            updateResume.birth_year = 123;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if birth_year is grather than 4 character`, async () => {
            updateResume.birth_year = 12345;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if marital_status is not in ${i18n.__("system.enums.marital_status")}`, async () => {
            updateResume.marital_status = faker.random.alpha(5);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if mobile is not valid mobile`, async () => {
            updateResume.mobile = faker.random.alpha(9);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if residence city id is not mongo id`, async () => {
            updateResume.residence_city = 'fakeId';
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if work city id is not mongo id`, async () => {
            updateResume.work_city = 'fakeId';
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if phone is less than 9 character`, async () => {
            updateResume.phone = faker.phone.number('98######');
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if phone is grather than 12 character`, async () => {
            updateResume.phone = faker.phone.number('98###########');
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if min_salary is less than 0 character`, async () => {
            updateResume.min_salary = -10;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if min_salary is grather than 1000000000 character`, async () => {
            updateResume.min_salary = 1000000000000;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if max_salary is less than 0 character`, async () => {
            updateResume.max_salary = -10;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if max_salary is grather than 1000000000 character`, async () => {
            updateResume.max_salary = 1000000000000;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if military_status is not in ${i18n.__("system.enums.military_status")}`, async () => {
            updateResume.military_status = faker.random.alpha(5);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send(updateResume);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`DELETE /:id`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not valid`, async () => {
            const response = await request(app)
                .delete(`/api/V1/resumes/fakeId`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if resume not found `, async () => {
            const response = await request(app)
                .delete(`/api/V1/resumes/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .delete(`/api/V1/resumes/${resume._id}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /:id/status`, () => {
        let updateResumeStatus;
        beforeEach(() => {
            updateResumeStatus = {
                'status': 'hired',
                'index': 1,
            }
        })
        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId/status`)
                .set(`Authorization`, token)
                .send(updateResumeStatus);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if resume not found `, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${Types.ObjectId()}/status`)
                .set(`Authorization`, token)
                .send(updateResumeStatus);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if status is not send`, async () => {
            delete updateResumeStatus.status;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/status`)
                .set(`Authorization`, token)
                .send(updateResumeStatus);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if status is not valid`, async () => {
            updateResumeStatus.status = faker.random.alpha(5);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/status`)
                .set(`Authorization`, token)
                .send(updateResumeStatus);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if index is not send`, async () => {
            delete updateResumeStatus.index;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/status`)
                .set(`Authorization`, token)
                .send(updateResumeStatus);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if index is not valid`, async () => {
            updateResumeStatus.index = faker.random.alpha(5);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/status`)
                .set(`Authorization`, token)
                .send(updateResumeStatus);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if status is already set for this resume`, async () => {
            updateResumeStatus.status = 'pending';
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/status`)
                .set(`Authorization`, token)
                .send(updateResumeStatus);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/status`)
                .set(`Authorization`, token)
                .send(updateResumeStatus);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe('PATCH /resumes/:id/file', () => {

        let file;
        beforeEach(async () => {
            file = path.join(__dirname, 'data/file/resumeFileValid.docx');
        })
        it(`should return ${httpStatus.BAD_REQUEST} error if resume id invalid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeid/file`)
                .set('Authorization', token)
                .attach('file', file);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });
        it(`should return ${httpStatus.NOT_FOUND} error if resume dont find`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${Types.ObjectId()}/file`)
                .set('Authorization', token)
                .attach('file', file);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        });
        it(`should return ${httpStatus.BAD_REQUEST} error if file empty`, async () => {
            const response = await request(app)
                .patch("/api/V1/resumes/" + resume._id + "/file")
                .set('Authorization', token)
                .attach('file', '');
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });
        it(`should return ${httpStatus.BAD_REQUEST} error if file incorect`, async () => {
            const response = await request(app)
                .patch("/api/V1/resumes/" + resume._id + "/file")
                .set('Authorization', token)
                .attach('file', path.join(__dirname, 'data/file/resumeFileInValid.zip'));
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });
        it(`should return ${httpStatus.OK} success if file corect`, async () => {
            const response = await request(app)
                .patch("/api/V1/resumes/" + resume._id + "/file")
                .set('Authorization', token)
                .attach('file', file);
            expect(response.statusCode).toBe(httpStatus.OK);
        });

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

        it(`should get no item if resume dont have any comment `, async () => {
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
            let data = response.body.data;
            expect(data.length).toBe(0);
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

    describe("PATCH /resumes/{id}/commments", () => {
        let data = {
            'body': faker.random.alpha(50),
        }

        it(`should get ${httpStatus.BAD_REQUEST} resume id is not a mongo id`, async () => {
            data.body = 'test text';
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeID/comments`,)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} resume is not exist `, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${Types.ObjectId()}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} body text is empty `, async () => {
            data.body = '';
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} body text is not send `, async () => {
            delete data.body;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} body text is less than 5 character `, async () => {
            data.body = faker.random.alpha(4);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST}body text is more than 1000 character `, async () => {
            data.body = faker.random.alpha(1001);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/comments`)
                .set('Authorization', token)
                .send(data);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should check field of object returned`, async () => {
            data.body = faker.random.alpha(50);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/comments`)
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

    describe(`PATCH /:id/call-history`, () => {

        let callHistory;
        beforeEach(async () => {
            callHistory = {
                '_id': Types.ObjectId(),
                'result': 'answered',
                'calling_date': faker.date.recent(),
                'description': faker.random.alpha(10),
                'recall_at': faker.date.future(1),
                "rating": "1",
                'created_by': user._id
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not MongoId`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if resume id is not valid`, async () => {
            let invalidResumeId = Types.ObjectId();
            const response = await request(app)
                .patch(`/api/V1/resumes/${invalidResumeId}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is not send`, async () => {
            delete callHistory.result
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is not enum`, async () => {
            callHistory.result = 'fakeResult'
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if calling_date is not send`, async () => {
            delete callHistory.calling_date
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if calling_date is not date`, async () => {
            callHistory.calling_date = 'fakeDate';
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is grather than 1000 character`, async () => {
            callHistory.description = faker.random.alpha(1001);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if result is recall and recall_at not send`, async () => {
            callHistory.result = 'recall'
            delete callHistory.recall_at;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is recall and recall_at is not date`, async () => {
            callHistory.result = 'recall'
            callHistory.recall_at = 'invalidDate';
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if result is recall and recall_at is in the past`, async () => {
            callHistory.result = 'recall'
            callHistory.recall_at = faker.date.past(10);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if rating is not send`, async () => {
            delete callHistory.rating
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if rating is not number`, async () => {
            callHistory.rating = 'test'
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if rating is less than 1`, async () => {
            callHistory.rating = 0
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if rating is more than 5`, async () => {
            callHistory.rating = 6
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })


        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/call-history`)
                .set(`Authorization`, token)
                .send(callHistory);
            console.log(response.body);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /:id/hire_status`, () => {

        let hireParams;
        beforeEach(() => {
            hireParams = {
                hire_status: "hired_on",
                income: 18000000
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not MongoId`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId/hire_status`)
                .set(`Authorization`, token)
                .send(hireParams);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} if resume id is not valid`, async () => {
            let invalidResumeId = Types.ObjectId();
            const response = await request(app)
                .patch(`/api/V1/resumes/${invalidResumeId}/hire_status`)
                .set(`Authorization`, token)
                .send(hireParams);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} hire status is required`, async () => {
            delete hireParams.hire_status
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/hire_status`)
                .set(`Authorization`, token)
                .send(hireParams);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} hire status is not valid`, async () => {
            hireParams.hire_status = 'test'
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/hire_status`)
                .set(`Authorization`, token)
                .send(hireParams);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} income  is not numeric`, async () => {
            hireParams.income = 'test'
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/hire_status`)
                .set(`Authorization`, token)
                .send(hireParams);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if hire status is 'hired_on' income cant be null`, async () => {
            hireParams.hire_status = 'hired_on'
            hireParams.income = ''
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/hire_status`)
                .set(`Authorization`, token)
                .send(hireParams);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })


        it(`should get ${httpStatus.OK} hire status updated successfuly`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/hire_status`)
                .set(`Authorization`, token)
                .send(hireParams);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`PATCH /:id/add_contributor`, () => {

        let contributor;
        beforeEach(() => {
            contributor = {
                contributor: user._id,
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not MongoId`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId/add_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} if resume id is not valid`, async () => {
            let invalidResumeId = Types.ObjectId();
            const response = await request(app)
                .patch(`/api/V1/resumes/${invalidResumeId}/add_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.NOT_FOUND} if contributor id is not valid`, async () => {
            let invalidContributor = {
                contributor: Types.ObjectId()
            }
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/add_contributor`)
                .set(`Authorization`, token)
                .send(invalidContributor);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} contributor is required`, async () => {
            delete contributor.contributor
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/add_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} contributor is not valid`, async () => {
            contributor.contributor = 'test'
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/add_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.OK} contributor added successfuly`, async () => {
            contributor.contributor = users[2]._id;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/add_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`PATCH /:id/remove_contributor`, () => {

        let contributor;
        beforeEach(() => {
            contributor = {
                contributor: resume.created_by,
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not MongoId`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId/remove_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} if resume id is not valid`, async () => {
            let invalidResumeId = Types.ObjectId();
            const response = await request(app)
                .patch(`/api/V1/resumes/${invalidResumeId}/remove_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.NOT_FOUND} if contributor id is not valid`, async () => {
            let invalidContributor = {
                contributor: Types.ObjectId()
            }
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/remove_contributor`)
                .set(`Authorization`, token)
                .send(invalidContributor);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} contributor is required`, async () => {
            delete contributor.contributor
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/remove_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} contributor is not valid`, async () => {
            contributor.contributor = 'test'
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/remove_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.OK} contributor remove successfuly`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/remove_contributor`)
                .set(`Authorization`, token)
                .send(contributor);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`PATCH /:id/avatar`, () => {
        let avatar;
        beforeEach(async () => {
            avatar = path.join(__dirname, 'data/file/avatar.png');
        })
        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId/avatar`)
                .set(`Authorization`, token)
                .attach('avatar', avatar);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if resume is not exists`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${Types.ObjectId()}/avatar`)
                .set(`Authorization`, token)
                .attach('avatar', avatar);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should return ${httpStatus.BAD_REQUEST} error if avatar incorect`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/avatar`)
                .set('Authorization', token)
                .attach('avatar', path.join(__dirname, 'data/file/avatar.zip'));
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/avatar`)
                .set(`Authorization`, token)
                .attach('avatar', avatar);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /:id/add_tags`, () => {

        let newTag;
        beforeEach(() => {
            newTag = {
                tag: faker.random.alpha(5),
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not MongoId`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId/add_tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} if resume id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${Types.ObjectId()}/add_tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if name is less than 3 character`, async () => {
            newTag.tag = faker.random.alpha(2);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/add_tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is grather than 100 character`, async () => {
            newTag.tag = faker.random.alpha(101);
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/add_tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if tag already saved`, async () => {
            newTag.tag = tagData.getTagById(resume.tags[0].id).name;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/add_tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.OK} tag added successfuly`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/add_tags`)
                .set(`Authorization`, token)
                .send(newTag);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`PATCH /:id/remove_tags`, () => {

        let removeTag;
        beforeEach(() => {
            removeTag = {
                tag_id: resume.tags[0].id,
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if resume id is not MongoId`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/fakeId/remove_tags`)
                .set(`Authorization`, token)
                .send(removeTag);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} if resume id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${Types.ObjectId()}/remove_tags`)
                .set(`Authorization`, token)
                .send(removeTag);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if tag_id is not send`, async () => {
            delete removeTag.tag_id;
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/remove_tags`)
                .set(`Authorization`, token)
                .send(removeTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if tag_id is not not valid`, async () => {
            removeTag.tag_id = 'fakeId';
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/remove_tags`)
                .set(`Authorization`, token)
                .send(removeTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if tag not exists`, async () => {
            removeTag.tag_id = Types.ObjectId();
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/remove_tags`)
                .set(`Authorization`, token)
                .send(removeTag);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.OK} tag added successfuly`, async () => {
            const response = await request(app)
                .patch(`/api/V1/resumes/${resume._id}/remove_tags`)
                .set(`Authorization`, token)
                .send(removeTag);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })
})




