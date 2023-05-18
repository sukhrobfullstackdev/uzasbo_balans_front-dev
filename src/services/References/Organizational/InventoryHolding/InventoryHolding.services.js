import ApiServices from "../../../api.services";

const baseUrl = "InventoryHolding/";

const InventoryHoldingServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  getCommonList(payload, endpoint) {
    return ApiServices.get(`${baseUrl}${endpoint}`, { params: payload })
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

};

export default InventoryHoldingServices;