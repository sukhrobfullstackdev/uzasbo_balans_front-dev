import ApiServices from "../../../api.services";

const baseUrl = "Contractor/";

const ContractorsServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getProfile(id) {
    return ApiServices.get(`${baseUrl}GetProfile?id=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
  
  updateProfile(data) {
    return ApiServices.post(`${baseUrl}UpdateProfile`, data);
  },

  print(payload) {
    return ApiServices.get(`${baseUrl}ContractorPrint`, {
      params: payload,
      responseType: "blob"
    })
  },

  printById(id) {
    return ApiServices.get(`${baseUrl}ContractorPrint?DocumentID=${id}`, { responseType: "blob" })
  },

};

export default ContractorsServices;