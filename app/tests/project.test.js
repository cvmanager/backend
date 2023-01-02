import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data';
import ProjectData from './data/project.data';
import ManagerData from './data/manager.data';
import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';

let token;
let project;
let manager;
let users;

prepareDB();
describe("Project Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();
        users = userData.getUsers();

        let projectData = new ProjectData();
        project = projectData.getProject();

        let managerData = new ManagerData();
        manager = managerData.getManager();

    })

    describe("PATCH /projects/{id}/manager", () => {

        it(`should get ${httpStatus.NOT_FOUND} project id is not valid`, async () => {
            const response = await request(app)
                .patch("/api/V1/projects/639c7ecfdb3ccff4925a6fa5/manager")
                .set('Authorization', token)
                .send({ 'manager_id': Types.ObjectId() });
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} project id is not a mongo id`, async () => {
            const response = await request(app)
                .patch("/api/V1/projects/fakeID/manager")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not sended`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not a mongo id`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send({ 'manager_id': 'fake' });
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} manager id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send({ 'manager_id': "639c7ecfdb3ccff4925a6fa5" });

            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} user is currently manager`, async () => {
            let newManager = {
                "id": Types.ObjectId(),
                "manager_id": manager.user_id,
                "user_id": manager._id,
            };

            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(newManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.CREATED} user successfully assign as manager`, async () => {
            let newManager = {
                "id": Types.ObjectId(),
                "manager_id": users[1]._id,
                "user_id": users[1]._id,
            };

            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(newManager);

            expect(response.statusCode).toBe(httpStatus.CREATED);
        })

    })
})
