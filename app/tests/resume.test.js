import httpStatus from 'http-status'
import request from 'supertest'
import { userOne, insertUsers, accessToken } from './fixtures/user.fixture.js'
import { resumeOne, insertResumes } from './fixtures/resume.fixture.js'
import setupTestDB from './utils/setupTestDB.js';
import env from '../helper/env.js';
import * as path from 'path'
import { Types } from 'mongoose';

let baseURL = env("TEST_BASE_URL")
setupTestDB();

describe('Resume routes', () => {

    let token;
    let newResume;
    beforeEach(async () => {
        await insertUsers([userOne]);
        await insertResumes([resumeOne])
        token = 'Bearer ' + await accessToken(userOne);

        newResume = {
            company_id: "638f13474e23a04f88077875",
            project_id: "638f13474e23a04f88077876",
            firstname: "test firstname",
            lastname: "test lastname",
            gender: "men",
            email: "sample_resume_email@gmail.com",
            birth_year: 1372,
            marital_status: "single",
            status: "pending",
            mobile: "989121211212",
            residence_city: "test residence city",
            work_city: "test work city",
            education: "phd",
            major: "test residence major",
            phone: "989121211212",
            min_salary: 100000,
            max_salary: 1000000,
            work_experience: 13,
            military_status: "included",
            status_updated_at: null,
            created_by: userOne._id,
        };
    })

    describe('PATCH /resumes/:id/file', () => {

        let file;
        beforeEach(async () => {
            file = path.join(__dirname, 'fixtures/file/resumeFileValid.docx');
        })

        describe('file check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if feild file empty', async () => {
                const response = await request(baseURL)
                    .patch("/resumes/" + resumeOne._id + "/file")
                    .set('Authorization', token)
                    .attach('file', '');
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.BAD_REQUEST + ' error if file corect', async () => {
                const response = await request(baseURL)
                    .patch("/resumes/" + resumeOne._id + "/file")
                    .set('Authorization', token)
                    .attach('file', path.join(__dirname, 'fixtures/file/resumeFileInValid.zip'));
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });

        });

        describe('resume check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if resume id empty', async () => {
                const response = await request(baseURL)
                    .patch("/resumes//file")
                    .set('Authorization', token)
                    .attach('file', file);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.BAD_REQUEST + ' error if resume id invalid', async () => {
                const response = await request(baseURL)
                    .patch("/resumes/wrong id/file")
                    .set('Authorization', token)
                    .attach('file', file);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.NOT_FOUND + ' error if resume dont find', async () => {
                const response = await request(baseURL)
                    .patch("/resumes/" + Types.ObjectId() + "/file")
                    .set('Authorization', token)
                    .attach('file', file);
                expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
            });

        });

        it('should return ' + httpStatus.OK + ' success if file corect', async () => {
            const response = await request(baseURL)
                .patch("/resumes/" + resumeOne._id + "/file")
                .set('Authorization', token)
                .attach('file', file);
            expect(response.statusCode).toBe(httpStatus.OK);
        });

    })
});

