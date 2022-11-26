// import httpStatus from 'http-status'
import request from 'supertest'
const baseURL = "http://localhost:3000/api/v1"
import { access_token } from './fixtures/user.fixture.js'

describe('Constant routes', () => {

    let token;
    beforeAll(() => {
        token = 'Bearer ' + access_token;
    })

    describe('GET /', () => {

        it("should check field of object returned", async () => {
            const response = await request(baseURL)
                .get("/constant")
                .set('Authorization', token)

            let data = response.body.data[0];
            expect(data).toHaveProperty('gender')
            expect(data).toHaveProperty('marital_status')
            expect(data).toHaveProperty('education')
            expect(data).toHaveProperty('military_status')
            expect(data).toHaveProperty('resume_status')
        })

        it('should get list of constant', async () => {
            const response = await request(baseURL)
                .get("/constant")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toEqual(200);
        })

    })
});

