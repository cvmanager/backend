import mongoose from "mongoose";
import env from '../helper/env.js'
import { fillProvinceTable } from "../helper/service/province.service"



mongoose.connect(
    `mongodb://${env('DB_USER_NAME')}:${env('DB_PASSWORD')}@${env('DB_HOST')}:${env('DB_PORT')}/${env('DB_NAME')}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then()
    .catch()

export const seedDB = async () => {
    await fillProvinceTable();
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('seeds were successfully implemented')
});
