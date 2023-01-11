import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';

const numberRowInsert = 3;
let i = 0;

let users = [];
for (i = 0; i < numberRowInsert; i++) {
    users.push({
        "_id": Types.ObjectId(),
        "firstname": faker.name.firstName(),
        "lastname": faker.name.lastName(),
        "username": faker.internet.userName(),
        "mobile": faker.phone.number('989#########'),
        "email": faker.internet.email(),
        "password": '12345678'
    })
}

let companies = [];
for (i = 0; i < numberRowInsert; i++) {
    companies.push({
        "_id": Types.ObjectId(),
        "name": faker.company.name(),
        "created_by": users[i]._id
    })
}

let projects = [];
for (i = 0; i < numberRowInsert; i++) {
    projects.push({
        "_id": Types.ObjectId(),
        "company_id": companies[i]._id,
        "name": faker.commerce.productName(),
        "description": faker.commerce.productDescription(),
        "created_by": users[i]._id
    })
}

let positions = [];
for (i = 0; i < numberRowInsert; i++) {
    positions.push({
        "_id": Types.ObjectId(),
        "company_id": companies[i]._id,
        "project_id": projects[i]._id,
        "title": faker.name.jobTitle(),
        "level": "mid",
        "created_by": users[i]._id
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
        "created_by": users[i]._id
    })
}

let resumeComments = [];
for (i = 0; i < numberRowInsert; i++) {
    resumeComments.push({
        "_id": Types.ObjectId(),
        "resume_id": resumes[i]._id,
        "body": faker.random.alpha(50),
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

export { users, companies, projects, positions, managers, resumes, resumeComments };