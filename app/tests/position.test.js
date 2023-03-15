import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data';
import ProjectData from './data/project.data';
import PositionData from './data/position.data';
import ManagerData from './data/manager.data';
import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import i18n from '../middlewares/lang.middleware.js'
import CompanyData from './data/company.data';

let token;
let user;
let project;
let position;
let manager;
let positionData;
let positionItem;
let companyItem;
let companyData;
let projectItem;
let projectData;

prepareDB();
describe(`Position Routes`, () => {

    beforeEach(async () => {

        companyData = new CompanyData();

        let userData = new UserData();
        token = userData.getAccessToken();
        user = userData.getUser();

        projectData = new ProjectData();
        project = projectData.getProject();

        positionData = new PositionData();
        position = positionData.getPosition();

        let managerData = new ManagerData();
        manager = managerData.getManagerByEntityId(position._id);

    })

    describe(`GET /`, () => {

        it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/positions?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get("/api/V1/positions?page=1&size=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get no item if name is not find`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions?page=1&size=1&query=no item`)
                .set(`Authorization`, token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it(`should get one item if page = 1 and size = 1`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions?page=1&size=1`)
                .set(`Authorization`, token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it(`should check field of object returned`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty(`project_id`)
            expect(data).toHaveProperty(`company_id`)
            expect(data).toHaveProperty(`title`)
            expect(data).toHaveProperty(`level`)
            expect(data).toHaveProperty(`is_active`)
            expect(data).toHaveProperty(`deleted`)
            expect(data).toHaveProperty(`description`)
            expect(data).toHaveProperty(`createdAt`)
            expect(data).toHaveProperty(`updatedAt`)
        })

        it(`should get list of positions`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe(`GET /:id`, () => {

        it(`should get ${httpStatus.BAD_REQUEST} position id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/fakeID`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} position id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} success if correct`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty(`_id`)
            expect(data).toHaveProperty(`company_id`)
            expect(data).toHaveProperty(`project_id`)
            expect(data).toHaveProperty(`title`)
            expect(data).toHaveProperty(`level`)
            expect(data).toHaveProperty(`is_active`)
            expect(data).toHaveProperty(`created_by`)
            expect(data).toHaveProperty(`deleted`)
            expect(data).toHaveProperty(`description`)
            expect(data).toHaveProperty(`createdAt`)
            expect(data).toHaveProperty(`updatedAt`)
            expect(response.statusCode).toBe(httpStatus.OK)
        })
    })

    describe(`POST /`, () => {

        let newPosition;
        beforeEach(async () => {
            newPosition = {
                '_id': Types.ObjectId(),
                'project_id': project._id,
                'title': faker.random.alpha(10),
                'level': 'mid',
                "description": faker.random.alpha(50),
                'created_by': user._id
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if company is_active is false`, async() => {
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

            projectItem = {
                "_id": Types.ObjectId(),
                "company_id": companyItem._id,
                "is_active": true,
                "created_by": Types.ObjectId(),
                "name": faker.company.name(),
                "description": faker.random.alpha(50),
            };
            projectData.addProject(projectItem);

            newPosition.project_id = projectItem._id;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} if project id is not send`, async () => {
            delete newPosition.project_id;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if project id is not valid`, async () => {
            newPosition.project_id = 'fake id';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if title is not send`, async () => {
            delete newPosition.title;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if title is less than 3 character`, async () => {
            newPosition.title = faker.random.alpha(2);
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if title is grather than 50 character`, async () => {
            newPosition.title = faker.random.alpha(51);
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is less than 10 character`, async () => {
            newPosition.description = faker.random.alpha(9);
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is grather than 100 character`, async () => {
            newPosition.description = faker.random.alpha(101);
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if level not in ${i18n.__('position.enums.level')}`, async () => {
            newPosition.level = 'wrong level';
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if project not found `, async () => {
            newPosition.project_id = Types.ObjectId();
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.CONFLICT} if position already exists `, async () => {
            newPosition.title = position.title;
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        })
        it(`should get ${httpStatus.CREATED} if all data correct `, async () => {
            const response = await request(app)
                .post(`/api/V1/positions`)
                .set(`Authorization`, token)
                .send(newPosition);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        })
    })

    describe(`PATCH /:id`, () => {

        let updatePosition;
        beforeEach(async () => {
            updatePosition = {
                'title': faker.random.alpha(10),
                "description": faker.random.alpha(50),
                'level': 'mid',
            }
        })

        it(`should get ${httpStatus.BAD_REQUEST} if position id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/fakeId`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if title is less than 3 character`, async () => {
            updatePosition.title = faker.random.alpha(2);
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if title is grather than 50 character`, async () => {
            updatePosition.title = faker.random.alpha(51);
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is less than 10 character`, async () => {
            updatePosition.description = faker.random.alpha(9);
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if description is grather than 100 character`, async () => {
            updatePosition.description = faker.random.alpha(101);
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if level not in ${i18n.__('position.enums.level')}`, async () => {
            updatePosition.level = 'wrong level';
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if position not found `, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.CONFLICT} if position already exists `, async () => {
            let duplicatePosition = {
                "_id": Types.ObjectId(),
                "company_id": position.company_id,
                "project_id": position.project_id,
                "title": 'duplicate title',
                "level": "mid",
                "created_by": position.created_by
            };
            await positionData.setPositions([duplicatePosition]);

            updatePosition.title = duplicatePosition.title;
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send(updatePosition);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`DELETE /:id`, () => {


        it(`should get ${httpStatus.BAD_REQUEST} if position id is not valid`, async () => {
            const response = await request(app)
                .delete(`/api/V1/positions/fakeId`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if position not found `, async () => {
            const response = await request(app)
                .delete(`/api/V1/positions/${Types.ObjectId()}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.OK} if all data correct `, async () => {
            const response = await request(app)
                .delete(`/api/V1/positions/${position._id}`)
                .set(`Authorization`, token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /positions/{id}/manager`, () => {

        let setManager;
        beforeEach(() => {
            setManager = {
                'manager_id': manager.user_id,
            };
        })

        it(`should get ${httpStatus.BAD_REQUEST} position id is not a mongo id`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/fakeID/manager`)
                .set(`Authorization`, token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} position id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/${Types.ObjectId()}/manager`)
                .set(`Authorization`, token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not sended`, async () => {
            delete setManager.manager_id
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}/manager`)
                .set(`Authorization`, token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.BAD_REQUEST} manager id is not a mongo id`, async () => {
            setManager.manager_id = 'fakeid'
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}/manager`)
                .set(`Authorization`, token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} manager id is not valid`, async () => {
            setManager.manager_id = Types.ObjectId()
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}/manager`)
                .set(`Authorization`, token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.CONFLICT} user is currently manager`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}/manager`)
                .set(`Authorization`, token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        })

        it(`should get ${httpStatus.CREATED} user successfully assign as manager`, async () => {
            setManager.manager_id = user._id
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}/manager`)
                .set(`Authorization`, token)
                .send(setManager);

            expect(response.statusCode).toBe(httpStatus.CREATED);
        })

    })

    describe("GET /positions/{id}/resumes", () => {
        it(`should get ${httpStatus.BAD_REQUEST} position id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/fakeID/resumes`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} position id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/${Types.ObjectId()}/resumes`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/${position._id}/resumes?size=a`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.OK} position resumes list `, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/${position._id}/resumes`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })


    describe(`GET /positions/{id}/managers`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} position id is not a mongo id`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/fakeID/managers`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })

        it(`should get ${httpStatus.NOT_FOUND} positions id is not valid`, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/${Types.ObjectId()}/managers`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })

        it(`should get ${httpStatus.OK} positions managers list `, async () => {
            const response = await request(app)
                .get(`/api/V1/positions/${position._id}/managers`)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /:id/active`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} if position id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/fakeId/active`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if position not found`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/${Types.ObjectId()}/active`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if position status was active befor`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}/active`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if all data correct and update position status`, async () => {
            positionItem = {
                "_id": Types.ObjectId(),
                "company_id": Types.ObjectId(),
                "project_id": Types.ObjectId(),
                "title": faker.random.alpha(15),
                "level": "mid",
                "description": faker.random.alpha(50),
                "created_by": Types.ObjectId(),
                "is_active": false,
            };
            positionData.addPosition(positionItem)
            const response = await request(app)
                .patch(`/api/V1/positions/${positionItem._id}/active`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

    describe(`PATCH /:id/deactive`, () => {
        it(`should get ${httpStatus.BAD_REQUEST} if position id is not valid`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/fakeId/deactive`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.NOT_FOUND} if position not found`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/${Types.ObjectId()}/deactive`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        })
        it(`should get ${httpStatus.BAD_REQUEST} if position status was deactive befor`, async () => {
            positionItem = {
                "_id": Types.ObjectId(),
                "company_id": Types.ObjectId(),
                "project_id": Types.ObjectId(),
                "title": faker.random.alpha(15),
                "level": "mid",
                "description": faker.random.alpha(50),
                "created_by": Types.ObjectId(),
                "is_active": false,
            };
            positionData.addPosition(positionItem)
            const response = await request(app)
                .patch(`/api/V1/positions/${positionItem._id}/deactive`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        })
        it(`should get ${httpStatus.OK} if all data correct and update position status`, async () => {
            const response = await request(app)
                .patch(`/api/V1/positions/${position._id}/deactive`)
                .set(`Authorization`, token);
            expect(response.statusCode).toBe(httpStatus.OK);
        })
    })

})
