import { Types } from 'mongoose';

import Position from '../../models/position.model';
import { projectOne } from './project.fixture';
import { companyOne } from './company.fixture';
import { userOne } from './user.fixture';

export const positionOne = {
  _id: Types.ObjectId(),
  project_id: projectOne._id,
  company_id: companyOne._id,
  title: "sample position title",
  level: "mid",
  created_by: userOne._id
};

export const insertPositions = async (positions) => {
  await Position.insertMany(positions);
};
