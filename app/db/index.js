import mongoose from "mongoose";
import Province from '../models/province.model.js'
import env from '../helper/env.js'
import provinces from './province.js'




mongoose.connect(
    `mongodb://${env('DB_USER_NAME')}:${env('DB_PASSWORD')}@${env('DB_HOST')}:${env('DB_PORT')}/${env('DB_NAME')}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then()
    .catch()



const seedDB = async () => {

    await Province.deleteMany({});
    await Province.insertMany(provinces);
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('seeds were successfully implemented')
});
