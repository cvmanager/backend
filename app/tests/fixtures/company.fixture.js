import { Types } from 'mongoose';

import Company from '../../models/company.model';
import { userOne } from './user.fixture';

export const companyOne = {
  _id: Types.ObjectId(),
  name: "sample company name",
  manager_id : userOne._id,
  created_by: userOne._id
};

export const insertCompanies = async (companies) => {
  await Company.insertMany(companies);
};
