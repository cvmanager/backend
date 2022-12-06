import { Types } from 'mongoose';

import Project from '../../models/project.model';
import { userOne } from './user.fixture';
import { companyOne } from './company.fixture';


export const projectOne = {
  _id: Types.ObjectId(),
  company_id : companyOne._id,
  manager_id : userOne._id,
  name: "sample project name",
  description: "sample description name",
  created_by: userOne._id
};

export const insertProjects = async (projects) => {
  await Project.insertMany(projects);
};
