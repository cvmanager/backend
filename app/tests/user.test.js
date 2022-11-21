import request from "supertest"
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzRkOGQ2MzU2MzZmZmRkMjE1ZjhjZDIiLCJpYXQiOjE2NjkwNDg3MjYsImV4cCI6MTY3MTY0MDcyNn0.hWbgxTMFgaktU2AtSvPRcfUWEdrprEt_uv3wpG5YV_E'
const baseURL = "http://localhost:8080/api/V1"
describe('User', () => {
    describe('endpoint /getMe', () => {
        it('should get unauthorized error', async () => {
            const response = await request(baseURL)
                .get("/users/getMe")
                .set('Authorization', 'fake token')
                .send();
            expect(response.statusCode).toEqual(401);
        });

        it('should get url not found', async () => {
            const response = await request(baseURL)
                .post("/users/getMe")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toEqual(404);
        })
    })
})