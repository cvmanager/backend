import { Types } from 'mongoose';

import Manager from '../../models/manager.model';
import { userSample } from './user.fixture';
import { positionSample } from './position.fixture';

export const managerOne = {
  _id: Types.ObjectId(),
  user_id: userSample._id,
  entity: 'positions',
  entity_id: positionSample._id,
  created_by : userSample._id
};

export const insertManagers = async (managers) => {



  await Manager.insertMany(managers);
};
