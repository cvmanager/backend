import Province from '../../models/province.model.js'

class ProvinceData {

    async getProvince() {
        const province = await Province.findOne();
        return province;
    }

    async getProvinces() {
        const provinces = await Province.find();
        return provinces;
    }

}

export default ProvinceData