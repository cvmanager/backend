import { Types } from 'mongoose';

import Manager from '../../models/manager.model';
import { userOne } from './user.fixture';
import { positionOne } from './position.fixture';

export const managerOne = {
  _id: Types.ObjectId(),
  user_id: userOne._id,
  entity: 'position',
  entity_id: positionOne._id,
  created_by : userOne._id
};

export const insertManagers = async (managers) => {



  await Manager.insertMany(managers);
};
