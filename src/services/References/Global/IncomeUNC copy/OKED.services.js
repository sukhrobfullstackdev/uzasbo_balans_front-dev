import ApiServices from "../../../api.services";

const baseUrl = "OKED/";

const OKEDServices = {
  getList(payload) {
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
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

};

export default OKEDServices;