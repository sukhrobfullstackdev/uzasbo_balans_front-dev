import ApiServices from "../../../api.services";

const baseUrl = "GlobalHelpers/";

const IncomeUNCServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetIncomeUNCList`, {
      params: payload
    })
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}GetIncomeUNC?id=${id}`);
  },

  update(data) {
    console.log(data);
    return ApiServices.post(`${baseUrl}UpdateIncomeUNC`, data);
  },

};

export default IncomeUNCServices;