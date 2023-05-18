import ApiServices from "../../../api.services";

const baseUrl = "InfoAcc/";

const InfoAccServices = {
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

  getsysTable() {
    return ApiServices.get(`${baseUrl}GetsysTable`);
  },
  
  getInfoAccList2(id) {
    return ApiServices.get(`${baseUrl}GetInfoAccList2?id=${id}`);
  },

};

export default InfoAccServices;