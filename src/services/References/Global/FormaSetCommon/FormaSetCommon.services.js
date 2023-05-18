import ApiServices from "../../../api.services";

const baseUrl = "FormaSetCommon/";

const FormaSetCommonServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetFormaSetCommonList`, {
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

export default FormaSetCommonServices;