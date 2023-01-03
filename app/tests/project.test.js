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
let user;

prepareDB();
describe("Project Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();
        users = userData.getUsers();
        user = userData.getUser();

        let projectData = new ProjectData();
        project = projectData.getProject();

        let managerData = new ManagerData();
        manager = managerData.getManagerByEntityId(project._id);

    })

    describe("PATCH /projects/{id}/manager", () => {

        let setManager;
        beforeEach(() => {
            setManager = {
                'manager_id': manager.user_id,
            };
        })

        it(`should get ${httpStatus.NOT_FOUND} project id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${Types.ObjectId()}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} project id is not a mongo id`, async () => {
            const response = await request(app)
                .patch("/api/V1/projects/fakeID/manager")
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not sended`, async () => {
            delete setManager.manager_id;
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not a mongo id`, async () => {
            setManager.manager_id = 'fakeid'
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} manager id is not valid`, async () => {
            setManager.manager_id = Types.ObjectId()
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} user is currently manager`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.CREATED} user successfully assign as manager`, async () => {
            setManager.manager_id = users[1]._id
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })

    })

    describe("DELETE /projects/{id}/manager", () => {

        let deleteManager;
        beforeEach(() => {
            deleteManager = {
                'manager_id': manager.user_id,
            };
        })

        it(`should get ${httpStatus.NOT_FOUND} project id is not valid`, async () => {
            const response = await request(app)
                .delete(`/api/V1/projects/${Types.ObjectId()}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} project id is not a mongo id`, async () => {
            const response = await request(app)
                .delete("/api/V1/projects/fakeID/manager")
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not sended`, async () => {
            delete deleteManager.manager_id
            const response = await request(app)
                .delete(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not a mongo id`, async () => {
            deleteManager.manager_id = 'fake'
            const response = await request(app)
                .delete(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} manager id is not valid`, async () => {
            deleteManager.manager_id = Types.ObjectId()
            const response = await request(app)
                .delete(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);

            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} user is not manager for this project`, async () => {
            deleteManager.manager_id = users[1]._id
            const response = await request(app)
                .delete(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} user is owner manager for this project`, async () => {
            const response = await request(app)
                .delete(`/api/V1/projects/${manager.entity_id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.OK} user successfully assign as manager`, async () => {
            deleteManager.manager_id = users[users.length - 1]._id
            const response = await request(app)
                .delete(`/api/V1/projects/${project._id}/manager`)
                .set('Authorization', token)
                .send(deleteManager);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })
})
