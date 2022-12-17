import httpStatus from 'http-status'
import request from 'supertest'
import { userSample, insertUsers, accessToken } from './fixtures/user.fixture.js'
import { companySample, insertCompanies } from './fixtures/company.fixture.js'
import { projectSample, insertProjects } from './fixtures/project.fixture.js'
import setupTestDB from './utils/setupTestDB.js';
import env from '../helper/env.js';
import { Types } from 'mongoose';

import { positionSample, insertPositions } from './fixtures/position.fixture.js'
import { managerSample, insertManagers } from './fixtures/manager.fixture.js'

let baseURL = env("TEST_BASE_URL")
setupTestDB();

describe('Position routes', () => {

    let token;
    let newPosition;
    beforeEach(async () => {
        await insertUsers([userSample]);
        await insertCompanies([companySample]);
        await insertProjects([projectSample]);
        await insertPositions(positionSample);
        await insertManagers(managerSample);
        token = 'Bearer ' + await accessToken(userSample);

        newPosition = {
            "project_id": projectSample._id,
            "company_id": companySample._id,
            "title": "test position",
            "level": "mid",
            "is_active": true
        };
    })

    // describe('GET /', () => {

    //     it('should get ' + httpStatus.INTERNAL_SERVER_ERROR + ' error if page is not number', async () => {
    //         const response = await request(baseURL)
    //             .get("/positions?page=string")
    //             .set('Authorization', token)
    //             .send();
    //         expect(response.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    //     })

    //     it('should get ' + httpStatus.OK + ' success if size sting and return empty', async () => {
    //         const response = await request(baseURL)
    //             .get("/positions?page=1&size=string")
    //             .set('Authorization', token)
    //             .send();
    //         let data = response.body.data[0].docs;

    //         expect(data.length).toBe(0);
    //         expect(response.statusCode).toBe(httpStatus.OK);
    //     })

    //     it('should get no item if name is not find', async () => {
    //         const response = await request(baseURL)
    //             .get("/positions?page=1&size=1&query=no item")
    //             .set('Authorization', token)
    //             .send();
    //         let data = response.body.data[0].docs;
    //         expect(data.length).toBe(0);
    //     })

    //     it('should get one item if page = 1 and size = 1', async () => {
    //         const response = await request(baseURL)
    //             .get("/positions?page=1&size=1")
    //             .set('Authorization', token)
    //             .send();
    //         let data = response.body.data[0].docs;
    //         expect(data.length).toBe(1);
    //     })

    //     it("should check field of object returned", async () => {
    //         const response = await request(baseURL)
    //             .get("/positions")
    //             .set('Authorization', token)
    //             .send();

    //         let data = response.body.data[0].docs[0];
    //         expect(data).toHaveProperty('_id')
    //         expect(data).toHaveProperty('project_id')
    //         expect(data).toHaveProperty('company_id')
    //         expect(data).toHaveProperty('title')
    //         expect(data).toHaveProperty('level')
    //         expect(data).toHaveProperty('is_active')
    //         expect(data).toHaveProperty('deleted')
    //         expect(data).toHaveProperty('createdAt')
    //         expect(data).toHaveProperty('updatedAt')
    //     })

    //     it('should get list of positions', async () => {
    //         const response = await request(baseURL)
    //             .get("/positions")
    //             .set('Authorization', token)
    //             .send();
    //         expect(response.statusCode).toBe(httpStatus.OK);
    //     })

    // })

    // describe('GET /:id', () => {

    //     it('should return ' + httpStatus.BAD_REQUEST + ' error if position id invalid', async () => {
    //         const response = await request(baseURL)
    //             .get("/positions/invalid id")
    //             .set('Authorization', token)
    //             .send();
    //         expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //     });
    //     it('should return ' + httpStatus.NOT_FOUND + ' error if position not found', async () => {
    //         const response = await request(baseURL)
    //             .get("/positions/" + Types.ObjectId())
    //             .set('Authorization', token)
    //             .send();
    //         expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    //     });
    //     it('should return ' + httpStatus.OK + ' if position found', async () => {
    //         const response = await request(baseURL)
    //             .get("/positions/" + positionSample._id)
    //             .set('Authorization', token)
    //             .send();
    //         expect(response.statusCode).toBe(httpStatus.OK);
    //     });

    //     it("should check field of object returned", async () => {
    //         const response = await request(baseURL)
    //             .get("/positions/" + positionSample._id)
    //             .set('Authorization', token)
    //             .send();

    //         let data = response.body.data[0];
    //         expect(data).toHaveProperty('_id')
    //         expect(data).toHaveProperty('project_id')
    //         expect(data).toHaveProperty('company_id')
    //         expect(data).toHaveProperty('title')
    //         expect(data).toHaveProperty('level')
    //         expect(data).toHaveProperty('is_active')
    //         expect(data).toHaveProperty('deleted')
    //         expect(data).toHaveProperty('createdAt')
    //         expect(data).toHaveProperty('updatedAt')
    //     })
    // })

    // describe('POST /', () => {

    //     describe('project check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if project_id field do not send', async () => {
    //             delete newPosition.project_id
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if project_id is not valid', async () => {
    //             newPosition.project_id = 'invalid project id'
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.NOT_FOUND + ' error if project is not found', async () => {
    //             newPosition.project_id = Types.ObjectId()
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    //         });

    //     })

    //     describe('company check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if company_id field do not send', async () => {
    //             delete newPosition.company_id
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if company_id is not valid', async () => {
    //             newPosition.company_id = 'invalid company id'
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.NOT_FOUND + ' error if company is not found', async () => {
    //             newPosition.company_id = Types.ObjectId()
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    //         });

    //     })

    //     describe('title check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if title field do not send', async () => {
    //             delete newPosition.title
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if title field smaller than 3 character', async () => {
    //             newPosition.title = 'a'
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if title field greater than 50 character', async () => {
    //             newPosition.title = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.FORBIDDEN + ' error if title is already saved for this project', async () => {
    //             newPosition.title = positionSample.title
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    //         });

    //     })

    //     describe('level check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if level field do not send', async () => {
    //             delete newPosition.level
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if level field none of enums positions list', async () => {
    //             newPosition.level = 'wrong level'
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });

    //     })

    //     describe('is_active check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if is_active is not valid', async () => {
    //             newPosition.is_active = 'wrong is_active'
    //             const response = await request(baseURL)
    //                 .post("/positions")
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });

    //     })

    //     it('should return ' + httpStatus.CREATED + ' success if all field is correct', async () => {
    //         const response = await request(baseURL)
    //             .post("/positions")
    //             .set('Authorization', token)
    //             .send(newPosition);
    //         expect(response.statusCode).toBe(httpStatus.CREATED);
    //     });

    // })

    // describe('PATCH /:id', () => {

    //     describe('project check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if project_id is not valid', async () => {
    //             newPosition.project_id = 'invalid project id'
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.NOT_FOUND + ' error if project is not found', async () => {
    //             newPosition.project_id = Types.ObjectId()
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    //         });

    //     })

    //     describe('company check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if company_id is not valid', async () => {
    //             newPosition.company_id = 'invalid company id'
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.NOT_FOUND + ' error if company is not found', async () => {
    //             newPosition.company_id = Types.ObjectId()
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    //         });

    //     })

    //     describe('title check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if title field smaller than 3 character', async () => {
    //             newPosition.title = 'a'
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if title field greater than 50 character', async () => {
    //             newPosition.title = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });
    //         it('should return ' + httpStatus.FORBIDDEN + ' error if title is already saved for this project', async () => {
    //             newPosition.title = positionSample.title
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    //         });

    //     })

    //     describe('level check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if level field none of enums positions list', async () => {
    //             newPosition.level = 'wrong level'
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });

    //     })

    //     describe('is_active check', () => {

    //         it('should return ' + httpStatus.BAD_REQUEST + ' error if is_active is not valid', async () => {
    //             newPosition.is_active = 'wrong is_active'
    //             const response = await request(baseURL)
    //                 .patch("/positions/" + positionSample._id)
    //                 .set('Authorization', token)
    //                 .send(newPosition);
    //             expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //         });

    //     })

    //     it('should return ' + httpStatus.NOT_FOUND + ' error if position not found', async () => {
    //         const response = await request(baseURL)
    //             .patch("/positions/" + Types.ObjectId())
    //             .set('Authorization', token)
    //             .send(newPosition);
    //         expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    //     });

    //     it('should return ' + httpStatus.OK + ' success if all field is correct', async () => {
    //         const response = await request(baseURL)
    //             .patch("/positions/" + positionSample._id)
    //             .set('Authorization', token)
    //             .send(newPosition);
    //         expect(response.statusCode).toBe(httpStatus.OK);
    //     });

    // })

    // describe('DELETE /:id', () => {

    //     it('should return ' + httpStatus.BAD_REQUEST + ' error if position id invalid', async () => {
    //         const response = await request(baseURL)
    //             .delete("/positions/invalid id")
    //             .set('Authorization', token)
    //             .send();
    //         expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    //     });
    //     it('should return ' + httpStatus.NOT_FOUND + ' error if position not found', async () => {
    //         const response = await request(baseURL)
    //             .delete("/positions/" + Types.ObjectId())
    //             .set('Authorization', token)
    //             .send();
    //         expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    //     });
    //     it('should return ' + httpStatus.OK + ' if position delete', async () => {
    //         const response = await request(baseURL)
    //             .delete("/positions/" + positionSample._id)
    //             .set('Authorization', token)
    //             .send();
    //         expect(response.statusCode).toBe(httpStatus.OK);
    //     });

    // })

    describe('POST /:id/manager', () => {

        let setManager;
        beforeEach(async () => {
            setManager = {
                "user_id": userSample._id,
                "entity": "position",
                "entity_id": positionSample._id
            }
        })

        describe('user check', () => {
            it('should return ' + httpStatus.BAD_REQUEST + ' error if user_id field dose not send', async () => {
                delete setManager.user_id
                const response = await request(baseURL)
                    .post(`/positions/${positionSample._id}/manager`)
                    .set('Authorization', token)
                    .send(setManager);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });

            it('should return ' + httpStatus.BAD_REQUEST + ' error if user_id is invalid', async () => {
                setManager.user_id = 'invalid user id'
                const response = await request(baseURL)
                    .post(`/positions/${positionSample._id}/manager`)
                    .set('Authorization', token)
                    .send(setManager);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });

            it('should return ' + httpStatus.NOT_FOUND + ' error if user not found', async () => {
                setManager.user_id = Types.ObjectId();

                const response = await request(baseURL)
                    .post(`/positions/${positionSample._id}/manager`)
                    .set('Authorization', token)
                    .send(setManager);
                expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
            });
        });

        describe('position check', () => {
            it('should return ' + httpStatus.BAD_REQUEST + ' error if position is invalid', async () => {
                const response = await request(baseURL)
                    .post(`/positions/invalid position id/manager`)
                    .set('Authorization', token)
                    .send(setManager);
                expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
            });

            it('should return ' + httpStatus.NOT_FOUND + ' error if position not found', async () => {
                const response = await request(baseURL)
                    .post(`/positions/${Types.ObjectId()}/manager`)
                    .set('Authorization', token)
                    .send(setManager);
                expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
            });
        });

        it('should return ' + httpStatus.CONFLICT + ' error if this manager set for this position already', async () => {
            const response = await request(baseURL)
                .post(`/positions/${positionSample._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.CONFLICT);
        });

        it('should return ' + httpStatus.CREATED + ' successfuly added manager for position', async () => {
            const userSampleTwo = {
                _id: Types.ObjectId(),
                firstname: "mani",
                lastname: "mohamadi",
                mobile: "989191930406",
                password: '123',
                is_banned: false
            };
            await insertUsers([userSampleTwo]);
            setManager.user_id = userSampleTwo._id
            const response = await request(baseURL)
                .post(`/positions/${positionSample._id}/manager`)
                .set('Authorization', token)
                .send(setManager);
            expect(response.statusCode).toBe(httpStatus.CREATED);
        });

    })
})

