import ApiServices from '../api.services';

const baseUrl = 'Helper/';

const HelperApis = {
  getHelperData(endpoint, payload) {
    return ApiServices.get(`${baseUrl}${endpoint}`, { params: payload })
  },
}

export default HelperApis;