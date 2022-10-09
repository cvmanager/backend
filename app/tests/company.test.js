import request from "supertest"

import i18n from '../middlewares/lang.middleware'
const baseURL = "http://localhost:3000/api"

describe("companies", () => {
  
  it("should create new company", async () => {
      var newCompany = {
          name: "test company"
      }
      const response = await request(baseURL)
        .post("/companies")
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzNhNzI1YWQwNGUxMGVkMTA1ZjQ0NjQiLCJpYXQiOjE2NjQ3NzQ3NDYsImV4cCI6MTY2NzM2Njc0Nn0.2f6ApurlmyL9NdYhkYBDTsWt25m0NZ_Yb3Oh8dEQ3tI')
        .send(newCompany)
        
      const resMessage = response.body.message

      newCompany.id = response.body.data._id
      expect(response.statusCode).toBe(201);
      expect(resMessage).toBe('company successfuly created');
    });

    it("should update a company", async () => {
      var company = {
        name: 'test company'
      }
      const response = await request(baseURL)
        .patch("/companies/634145b7a1aca50fc7bdf268")
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzNhNzI1YWQwNGUxMGVkMTA1ZjQ0NjQiLCJpYXQiOjE2NjQ3NzQ3NDYsImV4cCI6MTY2NzM2Njc0Nn0.2f6ApurlmyL9NdYhkYBDTsWt25m0NZ_Yb3Oh8dEQ3tI')
        .send(company)
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(200);
      expect(resMessage).toBe(i18n.__('company.suc.updated'));
    })

    
    it("should get a list of company", async () => {
      const response = await request(baseURL)
        .get("/companies")
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzNhNzI1YWQwNGUxMGVkMTA1ZjQ0NjQiLCJpYXQiOjE2NjQ3NzQ3NDYsImV4cCI6MTY2NzM2Njc0Nn0.2f6ApurlmyL9NdYhkYBDTsWt25m0NZ_Yb3Oh8dEQ3tI')
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(200);
      expect(resMessage).toBe(i18n.__('company.suc.found'));
    })
    
    it("should get a single company", async () => {
      const response = await request(baseURL)
        .get("/companies/634145c453a15a601c615c4a")
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzNhNzI1YWQwNGUxMGVkMTA1ZjQ0NjQiLCJpYXQiOjE2NjQ3NzQ3NDYsImV4cCI6MTY2NzM2Njc0Nn0.2f6ApurlmyL9NdYhkYBDTsWt25m0NZ_Yb3Oh8dEQ3tI')
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(200);
      expect(resMessage).toBe(i18n.__('company.suc.found'));
    })

    it("should remove a single company", async () => {
      const response = await request(baseURL)
        .delete("/companies/634145c453a15a601c615c4a")
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzNhNzI1YWQwNGUxMGVkMTA1ZjQ0NjQiLCJpYXQiOjE2NjQ3NzQ3NDYsImV4cCI6MTY2NzM2Njc0Nn0.2f6ApurlmyL9NdYhkYBDTsWt25m0NZ_Yb3Oh8dEQ3tI')
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(200);
      expect(resMessage).toBe(i18n.__('company.suc.deleted'));
    })

  });