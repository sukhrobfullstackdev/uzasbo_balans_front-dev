import ApiServices from "../../../api.services";

const baseUrl = "PaymentRequest/";

const PaymentRequestServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  getById(slug) {
    return ApiServices.get(`${baseUrl}Get${slug}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update?IsClone=${data.IsClone}`, data);
  },

  Accept(id, DateOfAcception) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}&DateOfAcception=${DateOfAcception}`);
  },

  cancel(id) {
    return ApiServices.post(`${baseUrl}Cancel?id=${id}`);
  },
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

};

export default PaymentRequestServices;