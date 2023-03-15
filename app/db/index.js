import mongoose from "mongoose";
import env from '../helper/env.js'
import { fillProvinceTable } from "../helper/service/province.service.js"
import roleService from "../helper/service/role.service.js";
import userService from "../helper/service/user.service.js";


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
    try {
        await fillProvinceTable();
    } catch (error) { console.log(error) }

    try {
        await roleService.fillRoles();
    } catch (error) { console.log(error) }

    try {
        await userService.fillUsers();
    } catch (error) { console.log(error) }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('seeds were successfully implemented')
});
