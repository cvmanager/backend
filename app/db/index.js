import mongoose from "mongoose";
import Province from '../models/province.model.js'
import env from '../helper/env.js'
import provinces from './province.js'
import City from "../models/city.model.js";




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

    let provinceArray = [];
    provinces.map((item) => {
        provinceArray.push({ name: item.name });
    })
    await Province.deleteMany({});
    await Province.insertMany(provinceArray)
        .then(async (items) => {
            let cities = [];
            items.map((province) => {
                const provinceInfo = provinces.find(element => element.name = province.name);
                provinceInfo.cities.map((hi) => {
                    let object = {
                        province_id: province._id,
                        name: hi.name,
                        latitude: hi.latitude,
                        longitude: hi.longitude,
                    }
                    cities.push(object);
                })

            })
            await City.deleteMany({});
            await City.insertMany(cities);
        })
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('seeds were successfully implemented')
});
