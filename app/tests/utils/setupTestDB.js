import mongoose from 'mongoose'

import env from '../../helper/env';

export default function setupTestDB () {
  beforeAll(async () => {
    await mongoose.connect(env("TEST_DB_URL"))
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};
