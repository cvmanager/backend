import httpStatus from 'http-status'
import request from 'supertest'
import app from '../app.js'
import UserData from './data/user.data'
import prepareDB from './utils/prepareDB'
import { Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import * as path from 'path'

let token
let users
let user
let userData
let userItem
prepareDB()
describe('User Routes', () => {
  beforeEach(async () => {
    userData = new UserData()
    token = userData.getAccessToken()
    users = userData.getUsers()
    user = userData.getUser()
  })

  describe('GET /', () => {
    it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
      const response = await request(app)
        .get('/api/V1/users?page=string')
        .set('Authorization', token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
      const response = await request(app)
        .get('/api/V1/users?page=1&size=string')
        .set('Authorization', token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it('should get no item if item is not find', async () => {
      const response = await request(app)
        .get('/api/V1/users?page=1&size=1&query=no item')
        .set('Authorization', token)
        .send()
      let data = response.body.data[0].docs
      expect(data.length).toBe(0)
    })

    it('should get one item if page = 1 and size = 1', async () => {
      const response = await request(app)
        .get('/api/V1/users?page=1&size=1')
        .set('Authorization', token)
        .send()
      let data = response.body.data[0].docs
      expect(data.length).toBe(1)
    })

    it(`will check properties and should return results with expected properties`, async () => {
      const response = await request(app)
        .get('/api/V1/users')
        .set('Authorization', token)
        .send()
      const data = response.body.data[0].docs[0]

      expect(data).toHaveProperty('_id')
      expect(data).toHaveProperty('firstname')
      expect(data).toHaveProperty('lastname')
      expect(data).toHaveProperty('mobile')
      expect(data).toHaveProperty('email')
      expect(data).toHaveProperty('mobile_verified_at')
      expect(data).toHaveProperty('avatar')
      expect(data).toHaveProperty('is_banned')
      expect(data).toHaveProperty('banned_by')
      expect(data).toHaveProperty('banned_at')
      expect(data).toHaveProperty('deleted')
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')
      expect(data).toHaveProperty('id')
    })

    it(`should get ${httpStatus.OK} list returned`, async () => {
      const response = await request(app)
        .get('/api/V1/users')
        .set('Authorization', token)
        .send()
      expect(response.statusCode).toBe(httpStatus.OK)
    })
  })

  describe(`GET /:id`, () => {
    it(`should get ${httpStatus.BAD_REQUEST} user id is not a mongo id`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/fakeID`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.NOT_FOUND} user id is not valid`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/${Types.ObjectId()}`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND)
    })

    it(`should get ${httpStatus.OK} success if correct`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/${user._id}`)
        .set(`Authorization`, token)
        .send()

      let data = response.body.data[0]
      expect(data).toHaveProperty('_id')
      expect(data).toHaveProperty('firstname')
      expect(data).toHaveProperty('lastname')
      expect(data).toHaveProperty('mobile')
      expect(data).toHaveProperty('email')
      expect(data).toHaveProperty('mobile_verified_at')
      expect(data).toHaveProperty('avatar')
      expect(data).toHaveProperty('is_banned')
      expect(data).toHaveProperty('banned_by')
      expect(data).toHaveProperty('banned_at')
      expect(data).toHaveProperty('deleted')
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')
      expect(data).toHaveProperty('id')
      expect(response.statusCode).toBe(httpStatus.OK)
    })
  })

  describe(`GET /getMe`, () => {
    it(`should get ${httpStatus.NOT_FOUND} user id is not valid`, async () => {
      let fakeToken = userData.getFakeAccessToken(Types.ObjectId())
      const response = await request(app)
        .get(`/api/V1/users/getMe`)
        .set(`Authorization`, fakeToken)
        .send()
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND)
    })
    it(`should get ${httpStatus.OK} success if correct`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/getMe`)
        .set(`Authorization`, token)
        .send()

      let data = response.body.data[0]
      expect(data).toHaveProperty('_id')
      expect(data).toHaveProperty('firstname')
      expect(data).toHaveProperty('lastname')
      expect(data).toHaveProperty('mobile')
      expect(data).toHaveProperty('email')
      expect(data).toHaveProperty('mobile_verified_at')
      expect(data).toHaveProperty('avatar')
      expect(data).toHaveProperty('is_banned')
      expect(data).toHaveProperty('banned_by')
      expect(data).toHaveProperty('banned_at')
      expect(data).toHaveProperty('deleted')
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')
      expect(data).toHaveProperty('id')
      expect(response.statusCode).toBe(httpStatus.OK)
    })
  })

  describe(`post /avatar`, () => {
    let avatar
    beforeEach(async () => {
      avatar = path.join(__dirname, '/data/file/avatar.png')
    })
    it(
      'should return ' + httpStatus.BAD_REQUEST + ' error if avatar empty',
      async () => {
        const response = await request(app)
          .post(`/api/V1/users/avatar`)
          .set('Authorization', token)
          .attach('avatar', '')
        expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
      },
    )
    it(`should get ${httpStatus.NOT_FOUND} user not found`, async () => {
      let fakeToken = userData.getFakeAccessToken(Types.ObjectId())
      const response = await request(app)
        .post(`/api/V1/users/avatar`)
        .set(`Authorization`, fakeToken)
        .attach('avatar', avatar)
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND)
    })
    it(`should get ${httpStatus.BAD_REQUEST} avatar is wrong`, async () => {
      const response = await request(app)
        .post(`/api/V1/users/avatar`)
        .set(`Authorization`, token)
        .attach('avatar', path.join(__dirname, '/data/file/avatar.zip'))
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })
    it(`should get ${httpStatus.OK} user avatar changed`, async () => {
      const response = await request(app)
        .post(`/api/V1/users/avatar`)
        .set(`Authorization`, token)
        .attach('avatar', avatar)
      expect(response.statusCode).toBe(httpStatus.OK)
    })
  })

  describe(`POST /:id/ban`, () => {
    it(`should get ${httpStatus.BAD_REQUEST} user id is not a mongo id`, async () => {
      const response = await request(app)
        .post(`/api/V1/users/fakeID/ban`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.NOT_FOUND} user id is not valid`, async () => {
      const response = await request(app)
        .post(`/api/V1/users/${Types.ObjectId()}/ban`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND)
    })

    it(`should get ${httpStatus.BAD_REQUEST} user is already banned`, async () => {
      let newBannedUser = {
        _id: Types.ObjectId(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        mobile: faker.phone.number('989#########'),
        is_banned: true,
        email: faker.internet.email(),
        password: faker.internet.password(),
      }
      userData.setUsers([newBannedUser])

      const response = await request(app)
        .post(`/api/V1/users/${newBannedUser._id}/ban`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.OK} if user banned `, async () => {
      const response = await request(app)
        .post(`/api/V1/users/${user._id}/ban`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.OK)
    })
  })

  describe(`PATCH /users/change-password`, () => {
    let params

    beforeEach(() => {
      params = {
        password: '11111111',
        old_password: '12345678',
      }
    })

    it(`should get ${httpStatus.NOT_FOUND} user id is not a mongo id`, async () => {
      let fakeToken = userData.getFakeAccessToken(Types.ObjectId())
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, fakeToken)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND)
    })

    it(`should get ${httpStatus.BAD_REQUEST} old_password is empty`, async () => {
      delete params.old_password
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} old_password cant be less than 8 character `, async () => {
      params.old_password = faker.random.alpha(7)
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} old_password cant be more than than 10 character `, async () => {
      params.old_password = faker.random.alpha(11)
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} password cant be  empty`, async () => {
      delete params.password
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} password cant be less than 8 character `, async () => {
      params.password = faker.random.alpha(7)
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} password cant be more than than 10 character `, async () => {
      params.password = faker.random.alpha(11)
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} old_password is invalid `, async () => {
      params.old_password = faker.random.alpha(8)
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} password and old_password  cant be duplicate `, async () => {
      let password = '12345678'
      params.old_password = password
      params.password = password
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.OK} password successfuly changed `, async () => {
      const response = await request(app)
        .patch(`/api/V1/users/change-password`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.OK)
    })
  })

  describe(`GET /:id/login-history`, () => {
    it(`should get ${httpStatus.BAD_REQUEST} user id is not a mongo id`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/fakeID/login-history`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.NOT_FOUND} user id is not valid`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/${Types.ObjectId()}/login-history`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND)
    })

    it('should get one item if page = 1 and size = 1', async () => {
      const response = await request(app)
        .get(`/api/V1/users/${user._id}/login-history?page=1&size=1`)
        .set('Authorization', token)
        .send()
      let data = response.body.data[0].docs
      expect(data.length).toBe(1)
    })
    it(`should get ${httpStatus.BAD_REQUEST} page is not number`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/${user._id}/login-history?page=string`)
        .set('Authorization', token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} size is not number`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/${user._id}/login-history?page=1&size=string`)
        .set('Authorization', token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.OK}  user login history list`, async () => {
      const response = await request(app)
        .get(`/api/V1/users/${user._id}/login-history`)
        .set(`Authorization`, token)
        .send()

      let data = response.body.data[0].docs[0]
      expect(data).toHaveProperty('_id')
      expect(data).toHaveProperty('user_id')
      expect(data).toHaveProperty('access_token')
      expect(data).toHaveProperty('refresh_token')
      expect(data).toHaveProperty('os')
      expect(data).toHaveProperty('cpu')
      expect(data).toHaveProperty('browser')
      expect(data).toHaveProperty('memory')
      expect(data).toHaveProperty('ip4')
      expect(data).toHaveProperty('ip6')
      expect(data).toHaveProperty('deleted')
      expect(data).toHaveProperty('createdAt')
      expect(data).toHaveProperty('updatedAt')
      expect(data).toHaveProperty('id')
      expect(response.statusCode).toBe(httpStatus.OK)
    })
  })

  describe(`PATCH /user/id/edit`, () => {
    let params
    beforeEach(() => {
      params = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.random.alpha(9),
        email: faker.internet.email(),
      }
    })

    it(`should get ${httpStatus.BAD_REQUEST} user id is not a mongo id`, async () => {
      const response = await request(app)
        .patch(`/api/V1/users/fakeID/edit`)
        .set(`Authorization`, token)
        .send()
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.NOT_FOUND} user id is not valid`, async () => {
      const response = await request(app)
        .patch(`/api/V1/users/${Types.ObjectId()}/edit`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND)
    })

    it(`should get ${httpStatus.BAD_REQUEST} username already exist`, async () => {
      userItem = {
        _id: Types.ObjectId(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.random.alpha(9),
        mobile: faker.phone.number('989#########'),
        email: faker.internet.email(),
        password: '12345678',
      }
      userData.addUser([userItem])

      params.username = userItem.username
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} email already exist`, async () => {
      userItem = {
        _id: Types.ObjectId(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.random.alpha(9),
        mobile: faker.phone.number('989#########'),
        email: faker.internet.email(),
        password: '12345678',
      }
      userData.addUser([userItem])

      params.email = userItem.email
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} if firstname is less than 3 character`, async () => {
      params.firstname = faker.random.alpha(2)
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} if firstname is grather than 80 character`, async () => {
      params.firstname = faker.random.alpha(81)
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} if lastname is less than 3 character`, async () => {
      params.lastname = faker.random.alpha(2)
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} if lastname is grather than 80 character`, async () => {
      params.lastname = faker.random.alpha(81)
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} if username is not send `, async () => {
      delete params.username
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} if email is not send`, async () => {
      delete params.email
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.BAD_REQUEST} if email is not correct`, async () => {
      params.email = 'email'
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
    })

    it(`should get ${httpStatus.OK} if everything is ok`, async () => {
      const response = await request(app)
        .patch(`/api/V1/users/${user._id}/edit`)
        .set(`Authorization`, token)
        .send(params)
      expect(response.statusCode).toBe(httpStatus.OK)
    })
  })
})
