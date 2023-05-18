import ApiServices from "../../../api.services";

const baseUrl = "Specification/";

const SpecificationServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetSpecificationHelperList`, {
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

export default SpecificationServices;