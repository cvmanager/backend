import City from '../../models/city.model.js'

class CityData {
    async getCity() {
        let city = await City.findOne({})
        return city
    }
}

export default CityData