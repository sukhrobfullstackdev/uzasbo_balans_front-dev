import ApiServices from "../../../api.services";

const baseUrl = "InventoryHoldingIntakeUnpaid/";

const InventoryHoldingIntakeUnpaidServices = {
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

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  cancel(id) {
    return ApiServices.post(`${baseUrl}Cancel?id=${id}`);
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

};

export default InventoryHoldingIntakeUnpaidServices;