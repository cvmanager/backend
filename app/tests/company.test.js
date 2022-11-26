import request from "supertest"
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzZhNGFkODE4OWUwOWIxMWIxODI1NGEiLCJpYXQiOjE2Njk0NjI5OTAsImV4cCI6MTY2OTQ3MDE5MH0.nKJF_SbFSXLtn4gXgl-Pyb3unZLf_x5Jv8H0TuVeOjY'
const baseURL = "http://localhost:3080/api/V1"
const companyId = '6381f836f0beeebaa8d97f7a';
const managerId = '636a4ad8189e09b11b18254a';

describe('Company routes', () => {
    describe('Patch /:id/manager', () => {

        it('should send companyId if not send companyId shooud return 400', async () => {
            const response = await request(baseURL)
                .patch("/companies/manager")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toEqual(400);
        });

        it('should send valid companyId if not send valid  companyId shooud return 400', async () => {
            const response = await request(baseURL)
                .patch("/companies/notValidId/manager")
                .set('Authorization', token)
                .send();
            expect(response.statusCode).toEqual(400);
        });

        it('should send managerId if not send managerId shooud return 400', async () => {
            const response = await request(baseURL)
                .patch("/companies/" + companyId + "/manager")
                .set('Authorization', token)
                .send({ 'manager_id': null });
            expect(response.statusCode).toEqual(400);
        });

        it('should send valid managerId if not send valid  managerId shooud return 400', async () => {
            const response = await request(baseURL)
                .patch("/companies/" + companyId + "/manager")
                .set('Authorization', token)
                .send({ 'manager_id': 'notValidManagerId' });
            expect(response.statusCode).toEqual(400);
        });

        it('shoud return 200', async () => {
            const response = await request(baseURL)
                .patch("/companies/" + companyId + "/manager")
                .set('Authorization', token)
                .send({ 'manager_id': managerId });
            expect(response.statusCode).toEqual(200);
        });


    })
})

