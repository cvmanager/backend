import Province from '../../models/province.model.js'
import provinces from '../../db/province.js'
import City from '../../models/city.model.js'

export const fillProvinceTable = async () => {
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