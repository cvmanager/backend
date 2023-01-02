import mongoose from 'mongoose'
import AllInit from '../init/all.init';
import env from '../../helper/env';

export default function prepareDB() {
  beforeAll(async () => {
    await mongoose.connect(`mongodb://${env('DB_USER_NAME')}:${env('DB_PASSWORD')}@${env('DB_HOST')}:${env('DB_PORT')}/${env('DB_NAME')}`, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));

    let allInit = new AllInit();
    await allInit.setData();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};
