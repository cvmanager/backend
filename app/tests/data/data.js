import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';

const numberRowInsert = 3;

let users = [];
for (let i = 0; i < numberRowInsert; i++) {
    users.push({
        "_id": Types.ObjectId(),
        "firstname": faker.name.firstName(),
        "lastname": faker.name.lastName(),
        "mobile": `98912111223${i}`,
        "email": faker.internet.email(),
        "password": faker.internet.password()
    })
}

let companies = [];
for (let i = 0; i < numberRowInsert; i++) {
    companies.push({
        "_id": Types.ObjectId(),
        "name": faker.company.name(),
        "created_by": users[i]._id
    })
}

let projects = [];
for (let i = 0; i < numberRowInsert; i++) {
    projects.push({
        "_id": Types.ObjectId(),
        "company_id": companies[i]._id,
        "name": faker.commerce.productName(),
        "description": faker.commerce.productDescription(),
        "created_by": users[i]._id
    })
}

let positions = [];
for (let i = 0; i < numberRowInsert; i++) {
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
for (let i = 0; i < numberRowInsert; i++) {
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
        "mobile": `98912111225${i}`,
        "residence_city": Types.ObjectId(),
        "work_city": Types.ObjectId(),
        "education": "diploma",
        "created_by": users[i]._id
    })
}

let managers = [];
for (let i = 0; i < numberRowInsert; i++) {
    managers.push({
        "_id": Types.ObjectId(),
        "user_id": users[i]._id,
        "entity": "projects",
        "entity_id": projects[i]._id,
        "created_by": users[i]._id
    })
}

export { users, companies, projects, positions, managers, resumes };