import ApiServices from "../../../api.services";

const baseUrl = "CurrencyCourse/";

const CurrencyCourseServices = {
  getList(payload) {
    console.log(payload);
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

};

export default CurrencyCourseServices;