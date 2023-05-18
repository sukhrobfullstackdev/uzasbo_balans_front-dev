import ApiServices from "../../../api.services";

const baseUrl = "IncomeCashOrder/";

const IncomeCashOrderServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
      
    })
  },

  getById(slug) {
    return ApiServices.get(`${baseUrl}Get${slug}`);
  },

  update(data, isClone) {
    return ApiServices.post(`${baseUrl}Update?IsClone=true`, data);
  },

  getAccept(id, NumberOfAcception) {
    return ApiServices.post(`${baseUrl}GetPaymentOrderInfo/?DocumentID=${id}&PaymentOrderID=${NumberOfAcception}&TableID=110`);
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
  
  printById(id) {
    return ApiServices.get(`${baseUrl}Print?ID=${id}`, { responseType: "blob" })
  },

};

export default IncomeCashOrderServices;