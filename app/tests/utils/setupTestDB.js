import mongoose from 'mongoose'

import env from '../../helper/env';

export default function setupTestDB() {
  beforeAll(async () => {
    await mongoose.connect(`mongodb://${env('DB_USER_NAME')}:${env('DB_PASSWORD')}@${env('DB_HOST')}:${env('DB_PORT')}/${env('DB_NAME')}`, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};
