import { Types } from 'mongoose';

const users = [
    {
        "_id": Types.ObjectId(),
        "firstname": "test first name 1",
        "lastname": "test last name 1",
        "mobile": "989121112233",
        "email": "testemail1@gmail.com",
        "password": "12345678",
    },
    {
        "_id": Types.ObjectId(),
        "firstname": "test first name 2",
        "lastname": "test last name 2",
        "mobile": "989121112244",
        "email": "testemail2@gmail.com",
        "password": "12345678",
    },
    {
        "_id": Types.ObjectId(),
        "firstname": "test first name 3",
        "lastname": "test last name 3",
        "mobile": "989121112255",
        "email": "testemail3@gmail.com",
        "password": "12345678",
    }
];

const companies = [
    {
        "_id": Types.ObjectId(),
        "name": "test company name 1",
        "created_by": users[0]._id
    },
    {
        "_id": Types.ObjectId(),
        "name": "test company name 2",
        "created_by": users[1]._id
    },
    {
        "_id": Types.ObjectId(),
        "name": "test company name 3",
        "created_by": users[2]._id
    }
]

const projects = [
    {
        "_id": Types.ObjectId(),
        "company_id": companies[0]._id,
        "name": "test project name 1",
        "description": "test project description",
        "created_by": users[0]._id
    },
    {
        "_id": Types.ObjectId(),
        "company_id": companies[1]._id,
        "name": "test project name 1",
        "description": "test project description",
        "created_by": users[1]._id
    },
    {
        "_id": Types.ObjectId(),
        "company_id": companies[2]._id,
        "name": "test project name 1",
        "description": "test project description",
        "created_by": users[2]._id
    }
]


const managers = [
    {
        "_id": Types.ObjectId(),
        "user_id": users[0]._id,
        "entity": "projects",
        "entity_id": projects[0]._id,
        "created_by": users[0]._id
    },
    {
        "_id": Types.ObjectId(),
        "user_id": users[0]._id,
        "entity": "companies",
        "entity_id": companies[0]._id,
        "created_by": users[0]._id
    },
    {
        "_id": Types.ObjectId(),
        "user_id": users[0]._id,
        "entity": "companies",
        "entity_id": projects[0]._id,
        "created_by": users[0]._id
    }
]



export { users, companies, projects, managers };