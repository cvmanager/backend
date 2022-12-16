import { Types } from 'mongoose';

import Project from '../../models/project.model';
import { userSample } from './user.fixture';
import { companySample } from './company.fixture';
import Manager from '../../models/manager.model';


export const projectSample = {
  _id: Types.ObjectId(),
  company_id: companySample._id,
  manager_id: userSample._id,
  name: "sample project name",
  description: "sample description name",
  created_by: userSample._id
};

export const projectManagerSample = {
  "user_id": userSample._id,
  "entity": "projects",
  "entity_id": projectSample._id,
  "created_by": userSample._id
}

export const insertProjects = async (projects) => {
  await Project.insertMany(projects);
};

export const insertProjectManager = async (managers) => {
  await Manager.insertMany(managers);
}