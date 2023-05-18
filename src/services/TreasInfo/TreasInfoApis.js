import ApiServices from '../api.services';

const baseUrl = 'TreasInfo/';

const TreasInfoApis = {
  getAllTreasCountry() {
    return ApiServices.get(`${baseUrl}GetAllTreasCountry`);
  },
}

export default TreasInfoApis;