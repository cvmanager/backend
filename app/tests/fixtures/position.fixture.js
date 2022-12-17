import { Types } from 'mongoose';

import Position from '../../models/position.model';
import { projectSample } from './project.fixture';
import { companySample } from './company.fixture';
import { userSample } from './user.fixture';

export const positionSample = {
  _id: Types.ObjectId(),
  project_id: projectSample._id,
  company_id: companySample._id,
  title: "sample position title",
  level: "mid",
  created_by: userSample._id
};

export const insertPositions = async (positions) => {
  await Position.insertMany(positions);
};
