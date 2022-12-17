import { Types } from 'mongoose';

import Company from '../../models/company.model';
import { userSample } from './user.fixture';

export const companySample = {
  _id: Types.ObjectId(),
  name: "sample company name",
  manager_id : userSample._id,
  created_by: userSample._id
};

export const insertCompanies = async (companies) => {
  await Company.insertMany(companies);
};
