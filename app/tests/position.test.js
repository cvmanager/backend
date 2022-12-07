import httpStatus from 'http-status'
import request from 'supertest'
import { userOne, insertUsers, accessToken } from './fixtures/user.fixture.js'
import { companyOne, insertCompanies } from './fixtures/company.fixture.js'
import { projectOne, insertProjects } from './fixtures/project.fixture.js'
import setupTestDB from './utils/setupTestDB.js';
import env from '../helper/env.js';
import { Types } from 'mongoose';
import { positionOne, insertPositions } from './fixtures/position.fixture.js'

let baseURL = env("TEST_BASE_URL")
setupTestDB();

describe('Postition routes', () => {

    let token;
    let newPostition;
    beforeEach(async () => {
        await insertUsers([userOne]);
        await insertCompanies([companyOne]);
        await insertProjects([projectOne]);
        await insertPositions(positionOne);

        token = 'Bearer ' + await accessToken(userOne);

        newPostition = {
            "project_id": projectOne._id,
            "company_id": companyOne._id,
            "title": "test position",
            "level": "mid",
            "is_active": true
        };
    })

    describe('GET /', () => {

        it('should get ' + httpStatus.INTERNAL_SERVER_ERROR + ' error if page is not number', async () => {
            const response = await request(baseURL)
                .get("/positions?page=string")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
        })

        it('should get ' + httpStatus.OK + ' success if size sting and return empty', async () => {
            const response = await request(baseURL)
                .get("/positions?page=1&size=string")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;

            expect(data.length).toBe(0);
            expect(response.statusCode).toBe(httpStatus.OK);
        })

        it('should get no item if name is not find', async () => {
            const response = await request(baseURL)
                .get("/positions?page=1&size=1&query=no item")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(0);
        })

        it('should get one item if page = 1 and size = 1', async () => {
            const response = await request(baseURL)
                .get("/positions?page=1&size=1")
                .set('Authorization', token)
                .send();
            let data = response.body.data[0].docs;
            expect(data.length).toBe(1);
        })

        it("should check field of object returned", async () => {
            const response = await request(baseURL)
                .get("/positions")
                .set('Authorization', token)
                .send();

            let data = response.body.data[0].docs[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('project_id')
            expect(data).toHaveProperty('company_id')
            expect(data).toHaveProperty('title')
            expect(data).toHaveProperty('level')
            expect(data).toHaveProperty('is_active')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
        })

        it('should get list of positions', async () => {
            const response = await request(baseURL)
                .get("/positions")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        })

    })

    describe('GET /:id', () => {

        it('should return ' + httpStatus.BAD_REQUEST + ' error if position id invalid', async () => {
            const response = await request(baseURL)
                .get("/positions/invalid id")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });
        it('should return ' + httpStatus.NOT_FOUND + ' error if position not found', async () => {
            const response = await request(baseURL)
                .get("/positions/" + Types.ObjectId())
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        });
        it('should return ' + httpStatus.OK + ' if position found', async () => {
            const response = await request(baseURL)
                .get("/positions/" + positionOne._id)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        });

        it("should check field of object returned", async () => {
            const response = await request(baseURL)
                .get("/positions/" + positionOne._id)
                .set('Authorization', token)
                .send();

            let data = response.body.data[0];
            expect(data).toHaveProperty('_id')
            expect(data).toHaveProperty('project_id')
            expect(data).toHaveProperty('company_id')
            expect(data).toHaveProperty('title')
            expect(data).toHaveProperty('level')
            expect(data).toHaveProperty('is_active')
            expect(data).toHaveProperty('deleted')
            expect(data).toHaveProperty('createdAt')
            expect(data).toHaveProperty('updatedAt')
        })
    })

    describe('POST /', () => {

        describe('project check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if project_id field dont send', async () => {
                delete newPostition.project_id
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.BAD_REQUEST + ' error if project_id is not valid', async () => {
                newPostition.project_id = 'invalid project id'
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.NOT_FOUND + ' error if project is not found', async () => {
                newPostition.project_id = Types.ObjectId()
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
            });

        })

        describe('company check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if company_id field dont send', async () => {
                delete newPostition.company_id
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.BAD_REQUEST + ' error if company_id is not valid', async () => {
                newPostition.company_id = 'invalid company id'
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.NOT_FOUND + ' error if company is not found', async () => {
                newPostition.company_id = Types.ObjectId()
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
            });

        })

        describe('title check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if title field dont send', async () => {
                delete newPostition.title
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.BAD_REQUEST + ' error if title field smaller than 3 character', async () => {
                newPostition.title = 'a'
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.BAD_REQUEST + ' error if title field grather than 50 character', async () => {
                newPostition.title = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.FORBIDDEN + ' error if title is already saved for this project', async () => {
                newPostition.title = positionOne.title
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
            });

        })

        describe('level check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if level field dont send', async () => {
                delete newPostition.level
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.BAD_REQUEST + ' error if level field none of enums positions list', async () => {
                newPostition.level = 'wrong level'
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });

        })

        describe('is_active check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if is_active is not valid', async () => {
                newPostition.is_active = 'wrong is_active'
                const response = await request(baseURL)
                    .post("/positions")
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });

        })

        it('should return ' + httpStatus.CREATED + ' success if all feild is correct', async () => {
            const response = await request(baseURL)
                .post("/positions")
                .set('Authorization', token)
                .send(newPostition);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        });

    })

    describe('PATCH /:id', () => {

        describe('project check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if project_id is not valid', async () => {
                newPostition.project_id = 'invalid project id'
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.NOT_FOUND + ' error if project is not found', async () => {
                newPostition.project_id = Types.ObjectId()
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
            });

        })

        describe('company check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if company_id is not valid', async () => {
                newPostition.company_id = 'invalid company id'
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.NOT_FOUND + ' error if company is not found', async () => {
                newPostition.company_id = Types.ObjectId()
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
            });

        })

        describe('title check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if title field smaller than 3 character', async () => {
                newPostition.title = 'a'
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.BAD_REQUEST + ' error if title field grather than 50 character', async () => {
                newPostition.title = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });
            it('should return ' + httpStatus.FORBIDDEN + ' error if title is already saved for this project', async () => {
                newPostition.title = positionOne.title
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
            });

        })

        describe('level check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if level field none of enums positions list', async () => {
                newPostition.level = 'wrong level'
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });

        })

        describe('is_active check', () => {

            it('should return ' + httpStatus.BAD_REQUEST + ' error if is_active is not valid', async () => {
                newPostition.is_active = 'wrong is_active'
                const response = await request(baseURL)
                    .patch("/positions/" + positionOne._id)
                    .set('Authorization', token)
                    .send(newPostition);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });

        })

        it('should return ' + httpStatus.NOT_FOUND + ' error if position not found', async () => {
            const response = await request(baseURL)
                .patch("/positions/" + Types.ObjectId())
                .set('Authorization', token)
                .send(newPostition);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        });

        it('should return ' + httpStatus.OK + ' success if all feild is correct', async () => {
            const response = await request(baseURL)
                .patch("/positions/" + positionOne._id)
                .set('Authorization', token)
                .send(newPostition);
            expect(response.statusCode).toBe(httpStatus.OK);
        });

    })

    describe('DELETE /:id', () => {

        it('should return ' + httpStatus.BAD_REQUEST + ' error if position id invalid', async () => {
            const response = await request(baseURL)
                .delete("/positions/invalid id")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
        });
        it('should return ' + httpStatus.NOT_FOUND + ' error if position not found', async () => {
            const response = await request(baseURL)
                .delete("/positions/" + Types.ObjectId())
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        });
        it('should return ' + httpStatus.OK + ' if position delete', async () => {
            const response = await request(baseURL)
                .delete("/positions/" + positionOne._id)
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toBe(httpStatus.OK);
        });

    })
})

