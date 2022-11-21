import httpStatus from 'http-status'
import request from 'supertest'
import { userOne, insertUsers } from './fixtures/user.fixture.js'
import setupTestDB from './utils/setupTestDB.js';
import env from '../helper/env.js';

let baseURL = env("TEST_BASE_URL")
setupTestDB();

describe('Auth routes', () => {

  describe('POST /auth/signup', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        firstname: "user",
        lastname: "test",
        mobile: "989123456789",
        password: "password1",
        password_confirm: "password1"
      };
    });

    describe('success signup', () => {

      it('should return 201 and successfully register user if request data is ok', async () => {
        
        const res = await request(baseURL).post('/auth/signup').send(newUser)
        
        expect(res.status).toBe(httpStatus.CREATED)
        expect(res.body.data[0]).toEqual({
          access_token: expect.anything(),
          refresh_token: expect.anything(),
        });
  
      });
    })

    describe('mobile check', () => {

      it('should return 400 error if mobile field not provided', async () => {
        delete newUser.mobile
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
  
      it('should return 400 error if mobile is invalid', async () => {
        newUser.mobile = 'invalidMobile';
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
  
      it('should return 400 error if mobile is already used', async () => {
        await insertUsers([userOne]);
        newUser.mobile = userOne.mobile;
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });  
    })

    describe('password check', () => {

      it('should return 400 error if password field not provided', async () => {
        delete newUser.password
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
  
      it('should return 400 error if confirm password field not provided', async () => {
        delete newUser.password_confirm
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
  
      it('should return 400 error if password length is less than 8 characters', async () => {
        newUser.password = 'passwo1';
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });

      it('should return 400 error if password length is greater than 10 characters', async () => {
        newUser.password = 'password910';
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
      
      it('should return 400 error if password and confirm password doesnt match', async () => {
        newUser.password = 'password1';
        newUser.password_confirm = 'password2'
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
    })

    describe('firstname check', () => {

      it('should return 400 error if firstname field not provided', async () => {
        delete newUser.firstname
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
  
      it('should return 400 error if firstname length is less than 3 characters', async () => {
        newUser.firstname = 'na';
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
            
      it('should return 400 error if lastname length is greater than 80 characters', async () => {
        let name = ""
        for (let i = 0; i < 81; i++) name += "c";
        newUser.firstname = name;
        
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
    })

    describe('lastname check', () => {
      it('should return 400 error if lastname field not provided', async () => {
        delete newUser.lastname
  
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
  
      it('should return 400 error if lastname length is less than 3 characters', async () => {
        newUser.lastname = 'la';
        
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });

      it('should return 400 error if lastname length is greater than 80 characters', async () => {
        let name = ""
        for (let i = 0; i < 81; i++) name += "c";
        newUser.lastname = name;
        
        let res = await request(baseURL).post('/auth/signup').send(newUser)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });

    })

  });
  
  describe('POST /auth/login', () => {

    let loginCredentials;
    beforeEach(() => {
      loginCredentials = {
        mobile: userOne.mobile,
        password: userOne.password,
      };
    });
    
    describe('success login', () => {
      it('should return 200 and login user if mobile and password match', async () => {
        await insertUsers([userOne]);
    
        const res = await request(baseURL).post('/auth/login').send(loginCredentials)
  
        expect(res.status).toBe(httpStatus.OK)

        expect(res.body.data[0]).toEqual({
          access_token:  expect.anything(),
          refresh_token: expect.anything()
        });
  
      });
    })
  
    describe('fail login', () => {
      it('should return 400 error if there are no users with that mobile', async () => {
        const res = await request(baseURL).post('/auth/login').send(loginCredentials)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
    
      it('should return 400 error if password is wrong', async () => {
        await insertUsers([userOne]);
        loginCredentials.password = "wrongpass"
    
        const res = await request(baseURL).post('/auth/login').send(loginCredentials)
    
        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });

      it('should return 400 error if user is banned', async () => {
        
        await insertUsers([{ ...userOne, is_banned: true }]);

        const res = await request(baseURL).post('/auth/login').send(loginCredentials)
    
        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
    })
    
    describe('password validations', () => {
      it('should return 400 error if password field not provided', async () => {
        delete loginCredentials.password
  
        let res = await request(baseURL).post('/auth/login').send(loginCredentials)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
  
      it('should return 400 error if password length is less than 8 characters', async () => {
        loginCredentials.password = 'passwo1';
  
        let res = await request(baseURL).post('/auth/login').send(loginCredentials)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });

      it('should return 400 error if password length is greater than 10 characters', async () => {
        loginCredentials.password = 'password910';
  
        let res = await request(baseURL).post('/auth/login').send(loginCredentials)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
    })

    describe('mobile validation', () => {
      it('should return 400 error if mobile field not provided', async () => {
        delete loginCredentials.mobile
  
        let res = await request(baseURL).post('/auth/signup').send(loginCredentials)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
  
      it('should return 400 error if mobile is invalid', async () => {
        loginCredentials.mobile = 'invalidMobile';
  
        let res = await request(baseURL).post('/auth/signup').send(loginCredentials)

        expect(res.status).toBe(httpStatus.BAD_REQUEST)
      });
    })
  });
  
});

