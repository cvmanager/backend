
import httpStatus from 'http-status'
import request from 'supertest'
import env from '../helper/env.js';
import { userSample, insertUsers, accessToken } from './fixtures/user.fixture.js'
import { companySample, insertCompanies } from './fixtures/company.fixture.js'
import { projectSample, insertProjects, insertProjectManager, projectManagerSample } from './fixtures/project.fixture.js'
import setupTestDB from './utils/setupTestDB.js';
import app from '../app.js'

setupTestDB();


describe("Project Routes", () => {
    let token;
    beforeEach(async () => {
        await insertUsers([userSample]);
        await insertCompanies([companySample]);
        await insertProjects([projectSample]);

        token = 'Bearer ' + await accessToken(userSample);

    })

    describe("PATCH /projects/{id}/manager", () => {
        it(`should get ${httpStatus.BAD_REQUEST} project id is not a mongo id`, async () => {
            const response = await request(app)
                .patch("/api/V1/projects/fakeID/manager")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);

        })

        it(`should get ${httpStatus.NOT_FOUND} project id is not valid`, async () => {
            const response = await request(app)
                .patch("/api/V1/projects/639c7ecfdb3ccff4925a6fa5/manager")
                .set('Authorization', token)
                .send({ 'manager_id': '639c7ecfdb3ccff4925a6fa5' });
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);

        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not sended`, async () => {
            const response = await request(app)
                .patch("/api/V1/projects/639c7ecfdb3ccff4925a6fa5/manager")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is a mongo id`, async () => {
            const response = await request(app)
                .patch("/api/V1/projects/639c7ecfdb3ccff4925a6fa5/manager")
                .set('Authorization', token)
                .send({ 'manager_id': 'fake' });
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);

        })

        it(`should get ${httpStatus.NOT_FOUND} manager id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${projectSample._id}/manager`)
                .set('Authorization', token)
                .send({ 'manager_id': '639c7ecfdb3ccff4925a6fa5' });
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} user is currently in manager`, async () => {
            await insertProjectManager([projectManagerSample]);
            const response = await request(app)
                .patch(`/api/V1/projects/${projectSample._id}/manager`)
                .set('Authorization', token)
                .send(projectManagerSample);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.CREATED} user successfully assign as manager`, async () => {


        })

    })
})
