import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { getRandomColor } from '../../helper/helper.js'

const numberRowInsert = 3;
let i = 0;

let users = [];
for (i = 0; i < numberRowInsert; i++) {
    users.push({
        "_id": Types.ObjectId(),
        "firstname": faker.name.firstName(),
        "lastname": faker.name.lastName(),
        "username": faker.random.alpha(9),
        "mobile": faker.phone.number('989#########'),
        "email": faker.internet.email(),
        "role": ["636793ebed4e4ba2664f2cbe"],
        "password": '12345678'
    })
}

let logHistory = [];
for (i = 0; i < numberRowInsert; i++) {
    logHistory.push({
        "_id": Types.ObjectId(),
        "user_id": users[i]._id,
        "access_token": faker.random.alpha(50),
        "refresh_token": faker.random.alpha(50),
        "os": faker.random.alpha(10),
        "cpu": faker.random.alpha(10),
        "browser": faker.random.alpha(10),
        "memory": faker.random.alpha(10),
        "ip4": faker.random.alpha(10),
        "ip6": faker.random.alpha(10),
    })
}

let companies = [];
for (i = 0; i < numberRowInsert; i++) {
    companies.push({
        "_id": Types.ObjectId(),
        "name": faker.company.name(),
        "description": faker.random.alpha(50),
        "phone": faker.phone.number('989#########'),
        "address": faker.random.alpha(100),
        "created_by": users[i]._id
    })
}

let projects = [];
for (i = 0; i < numberRowInsert; i++) {
    projects.push({
        "_id": Types.ObjectId(),
        "company_id": companies[i]._id,
        "name": faker.random.alpha(10),
        "description": faker.random.alpha(50),
        "created_by": users[i]._id
    })
}

let positions = [];
for (i = 0; i < numberRowInsert; i++) {
    positions.push({
        "_id": Types.ObjectId(),
        "company_id": companies[i]._id,
        "project_id": projects[i]._id,
        "title": faker.random.alpha(15),
        "level": "mid",
        "description": faker.random.alpha(50),
        "created_by": users[i]._id
    })
}

let tags = [];
for (i = 0; i < numberRowInsert; i++) {
    tags.push({
        "_id": Types.ObjectId(),
        "name": faker.random.alpha(5),
        "color": getRandomColor(),
        "count": 1
    })
}

let resumes = [];
for (i = 0; i < numberRowInsert; i++) {
    resumes.push({
        "_id": Types.ObjectId(),
        "company_id": companies[i]._id,
        "project_id": projects[i]._id,
        "position_id": positions[i]._id,
        "firstname": faker.name.firstName(),
        "lastname": faker.name.lastName(),
        "gender": "men",
        "email": faker.internet.email(),
        "birth_year": "1370",
        "marital_status": "married",
        "military_status": "included",
        "mobile": faker.phone.number('989#########'),
        "residence_city": Types.ObjectId(),
        "work_city": Types.ObjectId(),
        "education": "diploma",
        "created_by": users[i]._id,
        "contributors": [users[i]._id],
        "index": i,
        "tags": [{
            "id": tags[i]._id,
            "name": tags[i].name,
            "color": tags[i].color
        }],
    })
}

let resumeComments = [];
for (i = 0; i < numberRowInsert; i++) {
    resumeComments.push({
        "_id": Types.ObjectId(),
        "resume_id": resumes[i]._id,
        "body": faker.random.alpha(50),
        "created_by": users[i]._id
    })
}

let interviews = [];
for (i = 0; i < numberRowInsert; i++) {
    interviews.push({
        "_id": Types.ObjectId(),
        "resume_id": resumes[i]._id,
        "event_time": "2022-09-21",
        "event_type": "online",
        "status": "pending",
        "type": "person",
        "description": faker.random.alpha(50),
        "contribution": [],
        "created_by": users[i]._id,
    })
}

let managers = [];
for (i = 0; i < numberRowInsert; i++) {
    managers.push({
        "_id": Types.ObjectId(),
        "user_id": users[i]._id,
        "entity": "companies",
        "entity_id": projects[i]._id,
        "created_by": users[i]._id,
        "type": "owner"
    })
    managers.push({
        "_id": Types.ObjectId(),
        "user_id": users[numberRowInsert - 1]._id,
        "entity": "companies",
        "entity_id": companies[i]._id,
        "created_by": users[numberRowInsert - 1]._id,
        "type": "moderator"
    })

    managers.push({
        "_id": Types.ObjectId(),
        "user_id": users[i]._id,
        "entity": "projects",
        "entity_id": projects[i]._id,
        "created_by": users[i]._id,
        "type": "owner"
    })
    managers.push({
        "_id": Types.ObjectId(),
        "user_id": users[numberRowInsert - 1]._id,
        "entity": "projects",
        "entity_id": projects[i]._id,
        "created_by": users[numberRowInsert - 1]._id,
        "type": "moderator"
    })

    managers.push({
        "_id": Types.ObjectId(),
        "user_id": users[i]._id,
        "entity": "positions",
        "entity_id": projects[i]._id,
        "created_by": users[i]._id,
        "type": "owner"
    })
    managers.push({
        "_id": Types.ObjectId(),
        "user_id": users[numberRowInsert - 1]._id,
        "entity": "positions",
        "entity_id": positions[i]._id,
        "created_by": users[numberRowInsert - 1]._id,
        "type": "moderator"
    })

}

export { users, companies, projects, positions, managers, resumes, resumeComments, interviews, logHistory, tags };
