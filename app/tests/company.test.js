import request from "supertest"

import i18n from '../middlewares/lang.middleware'

const baseURL = "http://localhost:3000/api"
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzNhNzI1YWQwNGUxMGVkMTA1ZjQ0NjQiLCJpYXQiOjE2NjQ3NzQ3NDYsImV4cCI6MTY2NzM2Njc0Nn0.2f6ApurlmyL9NdYhkYBDTsWt25m0NZ_Yb3Oh8dEQ3tI'
const companyId = "634250781b017ba25c402983" // company id in database to test

describe("endpoints /companies", () => {
  
  it("should create new company", async () => {
      let newCompany = {
          name: "test company"
      }

      const response = await request(baseURL)
        .post("/companies")
        .set('Authorization', token)
        .send(newCompany)
        
      const resMessage = response.body.message

      newCompany.id = response.body.data._id
      expect(response.statusCode).toBe(201);
      expect(resMessage).toBe(i18n.__('company.message.company_successfuly_created'));
    });

    it("should update a company", async () => {
      let company = {
        name: 'test company'
      }

      const response = await request(baseURL)
        .patch("/companies/" + companyId)
        .set('Authorization', token)
        .send(company)
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(200);
      expect(resMessage).toBe(i18n.__('company.message.company_successfuly_updated'));
    })

    
    it("should get a list of company", async () => {
      const response = await request(baseURL)
        .get("/companies")
        .set('Authorization', token)
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(200);
      expect(resMessage).toBe(i18n.__('company.message.company_successfuly_updated'));
    })
    
    it("should get a single company", async () => {
      const response = await request(baseURL)
        .get("/companies/" + companyId)
        .set('Authorization', token)
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(200);
      expect(resMessage).toBe(i18n.__('company.message.company_found'));
    })

    it("should remove a single company", async () => {
      const response = await request(baseURL)
        .delete("/companies/" + companyId)
        .set('Authorization', token)
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(200);
      expect(resMessage).toBe(i18n.__('company.message.company_successfuly_deleted'));
    })

    /*
      [method, route, message, statusCode]
    */
    it.each([
      ["patch", "/634145c453a15a601c615c4a", "company.err.not_found", 404],
      ["delete", "/634145c453a15a601c615c4a", "company.err.not_found", 404],
      ["get", "/634145c453a15a601c615c4a", "company.err.not_found", 404]
    ])("should %s company return not found", async (method, route, message, statusCode) => {
      const response = await request(baseURL)
        [method]("/companies" + route)
        .set('Authorization', token)
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(statusCode);
      expect(resMessage).toBe(i18n.__(message));
    })
  });

  describe("Validation/ companies", () => {
    /*
      [method, route, message, statusCode, body?]  
    */
    it.each([
      ["post", "", "company.validation.company_name_required", 400],
      ["patch", "/123", "company.validation.company_id_invalid", 400],
      ["delete", "/123", "company.validation.company_id_invalid", 400],
      ["get", "/123", "company.validation.company_id_invalid", 400]
    ])("%s input should return with bad request status", async (method, route, message, statusCode) => {

      const response = await request(baseURL)
        [method]("/companies" + route)
        .set('Authorization', token)
        
      const resMessage = response.body.message

      expect(response.statusCode).toBe(statusCode);
      expect(resMessage).toBe(i18n.__("error.bad_request"));
      expect(response.body.errors).toContain(i18n.__(message))
    });
  
  });