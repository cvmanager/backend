import { Types } from 'mongoose';
import { makeText } from '../../helper/helper'

const users = [
    {
        "_id": Types.ObjectId(),
        "firstname": makeText(6),
        "lastname": makeText(6),
        "mobile": "989121112233",
        "email": `${makeText(8)}@gmail.com`,
        "password": "12345678",
    },
    {
        "_id": Types.ObjectId(),
        "firstname": makeText(6),
        "lastname": makeText(6),
        "mobile": "989121112244",
        "email": `${makeText(8)}@gmail.com`,
        "password": "12345678",
    },
    {
        "_id": Types.ObjectId(),
        "firstname": makeText(6),
        "lastname": makeText(6),
        "mobile": "989121112255",
        "email": `${makeText(8)}@gmail.com`,
        "password": "12345678",
    }
];

const companies = [
    {
        "_id": Types.ObjectId(),
        "name": makeText(11),
        "created_by": users[0]._id
    },
    {
        "_id": Types.ObjectId(),
        "name": makeText(11),
        "created_by": users[1]._id
    },
    {
        "_id": Types.ObjectId(),
        "name": makeText(11),
        "created_by": users[2]._id
    }
]

const projects = [
    {
        "_id": Types.ObjectId(),
        "company_id": companies[0]._id,
        "name": makeText(11),
        "description": makeText(11),
        "created_by": users[0]._id
    },
    {
        "_id": Types.ObjectId(),
        "company_id": companies[1]._id,
        "name": makeText(11),
        "description": makeText(11),
        "created_by": users[1]._id
    },
    {
        "_id": Types.ObjectId(),
        "company_id": companies[2]._id,
        "name": makeText(11),
        "description": makeText(11),
        "created_by": users[2]._id
    }
]

const positions = [
    {
        "_id": Types.ObjectId(),
        "company_id": companies[0]._id,
        "project_id": projects[0]._id,
        "title": makeText(11),
        "level": "mid",
        "created_by": users[0]._id
    },
    {
        "_id": Types.ObjectId(),
        "company_id": companies[1]._id,
        "project_id": projects[1]._id,
        "title": makeText(11),
        "level": "mid",
        "created_by": users[1]._id
    },
    {
        "_id": Types.ObjectId(),
        "company_id": companies[2]._id,
        "project_id": projects[2]._id,
        "title": makeText(11),
        "level": "mid",
        "created_by": users[2]._id
    }
]

const resumes = [
    {
        "_id": Types.ObjectId(),
        "company_id": companies[0]._id,
        "project_id": projects[0]._id,
        "position_id": positions[0]._id,
        "firstname": makeText(6),
        "lastname":  makeText(6),
        "gender": "men",
        "email": `${makeText(8)}@gmail.com`,
        "birth_year": "1370",
        "marital_status": "married",
        "military_status": "included",
        "mobile": "989121112255",
        "residence_city": Types.ObjectId(),
        "work_city": Types.ObjectId(),
        "education": "diploma",
        "created_by": users[1]._id
    },
    {
        "_id": Types.ObjectId(),
        "company_id": companies[1]._id,
        "project_id": projects[1]._id,
        "position_id": positions[1]._id,
        "firstname": makeText(6),
        "lastname":  makeText(6),
        "gender": "men",
        "email": `${makeText(8)}@gmail.com`,
        "birth_year": "1370",
        "marital_status": "married",
        "military_status": "included",
        "mobile": "989121112255",
        "residence_city": Types.ObjectId(),
        "work_city": Types.ObjectId(),
        "education": "diploma",
        "created_by": users[1]._id
    },
    {
        "_id": Types.ObjectId(),
        "company_id": companies[2]._id,
        "project_id": projects[2]._id,
        "position_id": positions[2]._id,
        "firstname": makeText(6),
        "lastname":  makeText(6),
        "gender": "men",
        "email": `${makeText(8)}@gmail.com`,
        "birth_year": "1370",
        "marital_status": "married",
        "military_status": "included",
        "mobile": "989121112255",
        "residence_city": Types.ObjectId(),
        "work_city": Types.ObjectId(),
        "education": "diploma",
        "created_by": users[1]._id
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
        "user_id": users[1]._id,
        "entity": "companies",
        "entity_id": companies[0]._id,
        "created_by": users[1]._id
    },
    {
        "_id": Types.ObjectId(),
        "user_id": users[2]._id,
        "entity": "positions",
        "entity_id": positions[0]._id,
        "created_by": users[2]._id
    }
]

export { users, companies, projects, positions, managers, resumes };