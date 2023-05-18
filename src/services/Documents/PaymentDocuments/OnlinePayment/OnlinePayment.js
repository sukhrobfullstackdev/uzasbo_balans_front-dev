import ApiServices from "../../../api.services";

const baseUrl = "OnlinePayment/";

const OnlinePaymentServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  print(payload) {
    return ApiServices.get(`${baseUrl}ContractorPrint`, {
      params: payload,
      responseType: "blob"
    })
  },

};

export default OnlinePaymentServices;