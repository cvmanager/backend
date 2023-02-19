import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data';
import CompanyData from './data/company.data';
import ProjectData from './data/project.data';
import ManagerData from './data/manager.data';
import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import * as path from 'path';

let token;
let company;
let project;
let manager;
let users;
let user;
let projectData;
let companyData;
let projectItem;

prepareDB();
describe("Project Routes", () => {

    beforeEach(async () => {
        let userData = new UserData();
        token = userData.getAccessToken();
        users = userData.getUsers();
        user = userData.getUser();

        companyData = new CompanyData();
        company = companyData.getCompany();

        projectData = new ProjectData();
        project = projectData.getProject();

        let managerData = new ManagerData();
        manager = managerData.getManagerByEntityId(project._id);
    })

    describe('GET /', () => {
        it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/projects?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/projects?page=1&size=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it('should get no item if name is not find', async () => {
            const response = await request(app)
                .get("/api/V1/projects?page=1&size=1&query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(app)
                .get("/api/V1/projects?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(app)
                .get("/api/V1/projects")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('company_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('description')
            expect(data).toHaveProperty('is_active')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('logo')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
        })

        it('should get list of projects', async () => {
            const response = await request(app)
                .get("/api/V1/projects")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`GET /:id`, () => {

        it(`should get ${httpStatus.BAD_REQUEST} project id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/fakeID`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} project id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} success if correct`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/${project._id}`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('company_id')
            expect(data).toHaveProperty('name')
            expect(data).toHaveProperty('description')
            expect(data).toHaveProperty('is_active')
            expect(data).toHaveProperty('created_by')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('logo')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
            expect(data).toHaveProperty('id')
            expect(response.statusCode).toBe(httpStatus.OK)
        })
    })

    describe(`POST /`, () => {

        let newProject;
        beforeEach(async () => {
            newProject = {
                '_id': Types.ObjectId(),
                'company_id': company._id,
                'name': faker.random.alpha(10),
                'description': faker.random.alpha(10),
                'created_by': user._id
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if company id is not send`, async () => {
            delete newProject.company_id;
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if company id is not valid`, async () => {
            newProject.company_id = 'fake id';
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is not send`, async () => {
            delete newProject.name;
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is less than 3 character`, async () => {
            newProject.name = faker.random.alpha(2);
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is grather than 50 character`, async () => {
            newProject.name = faker.random.alpha(51);
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is less than 10 character`, async () => {
            newProject.description = faker.random.alpha(5);
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is grather than 200 character`, async () => {
            newProject.description = faker.random.alpha(201);
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.CONFLICT} if project already exists in company`, async () => {
            newProject.name = project.name;
            newProject.company_id = project.company_id;
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        })
        it(`should get ${httpStatus.NOT_FOUND} if company not found `, async () => {
            newProject.company_id = Types.ObjectId();
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.CREATED} if all data correct `, async () => {
            const response = await request(app)
                .post(`/api/V1/projects`)
                .set(`Authorization`, token)
                .send(newProject);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })
    })

    describe(`PATCH /:id`, () => {

        let updateProject;
        beforeEach(async () => {
            updateProject = {
                'name': faker.random.alpha(10),
                'description': faker.random.alpha(10),
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if project id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/fakeId`)
                .set(`Authorization`, token)
                .send(updateProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is less than 3 character`, async () => {
            updateProject.name = faker.random.alpha(2);
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}`)
                .set(`Authorization`, token)
                .send(updateProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if name is grather than 50 character`, async () => {
            updateProject.name = faker.random.alpha(51);
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}`)
                .set(`Authorization`, token)
                .send(updateProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is less than 10 character`, async () => {
            updateProject.description = faker.random.alpha(5);
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}`)
                .set(`Authorization`, token)
                .send(updateProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is grather than 200 character`, async () => {
            updateProject.description = faker.random.alpha(201);
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}`)
                .set(`Authorization`, token)
                .send(updateProject);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if project is not exists`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send(updateProject);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.CONFLICT} if project already exists in company`, async () => {
            let duplicateProject = {
                "_id": Types.ObjectId(),
                "company_id": project.company_id,
                "name": 'duplicate name',
                "description": faker.commerce.productDescription(),
                "created_by": project.created_by
            };
            await projectData.setProjects([duplicateProject]);

            updateProject.name = duplicateProject.name;
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}`)
                .set(`Authorization`, token)
                .send(updateProject);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}`)
                .set(`Authorization`, token)
                .send(updateProject);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
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

    describe("GET /projects/{id}/positions", () => {
        it(`should get ${httpStatus.BAD_REQUEST} project id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/fakeID/positions`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} project id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/${Types.ObjectId()}/positions`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} project resumes list `, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/${project._id}/positions`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`GET /projects/{id}/managers`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} project id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/fakeID/managers`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} project id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/${Types.ObjectId()}/managers`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} projecta managers list `, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/${project._id}/managers`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe("GET /projects/{id}/resumes", () => {
        it(`should get ${httpStatus.BAD_REQUEST} project id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/fakeID/resumes`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} project id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/${Types.ObjectId()}/resumes`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} project resumes list `, async () => {
            const response = await request(app)
                .get(`/api/V1/projects/${project._id}/resumes`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /:id/active`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} if project id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/fakeId/active`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if project not found`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${Types.ObjectId()}/active`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if project status was active befor`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/active`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if all data correct and update project status`, async () => {
            projectItem = {
                "_id": Types.ObjectId(),
                "company_id": Types.ObjectId(),
                "is_active": false,
                "created_by": Types.ObjectId(),
                "name": faker.company.name(),
                "description": faker.random.alpha(50),
            };
            projectData.addProject(projectItem)
            const response = await request(app)
                .patch(`/api/V1/projects/${projectItem._id}/active`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /:id/deactive`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} if project id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/fakeId/deactive`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if project not found`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${Types.ObjectId()}/deactive`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if project status was deactive befor`, async () => {
            projectItem = {
                "_id": Types.ObjectId(),
                "company_id": Types.ObjectId(),
                "is_active": false,
                "created_by": Types.ObjectId(),
                "name": faker.company.name(),
                "description": faker.random.alpha(50),
            };
            projectData.addProject(projectItem)
            const response = await request(app)
                .patch(`/api/V1/projects/${projectItem._id}/deactive`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if all data correct and update project status`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/deactive`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /:id/logo`, () => {

        let logo;
        beforeEach(async () => {
            logo = path.join(__dirname, 'data/file/avatar.png');
        })

        it(`should get ${httpStatus.BAD_REQUEST} if project id is not send`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects//logo`)
                .set(`Authorization`, token)
                .attach('logo', logo);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if project id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/fakeId/logo`)
                .set(`Authorization`, token)
                .attach('logo', logo);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if project is not exists`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${Types.ObjectId()}/logo`)
                .set(`Authorization`, token)
                .attach('logo', logo);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should return ${httpStatus.BAD_REQUEST} error if logo incorect`, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/logo`)
                .set('Authorization', token)
                .attach('logo', path.join(__dirname, 'data/file/avatar.zip'));
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .patch(`/api/V1/projects/${project._id}/logo`)
                .set(`Authorization`, token)
                .attach('logo', logo);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })
})
