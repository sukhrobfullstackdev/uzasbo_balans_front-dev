import ApiServices from '../api.services';

const baseUrl = 'FormN2/';

const FormN2Apis = {
    getDashboardList(payload) {
    return ApiServices.get(`${baseUrl}GetDashboardList`, { params: payload })
  },
}

export default FormN2Apis;