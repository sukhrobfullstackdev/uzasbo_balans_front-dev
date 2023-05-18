import ApiServices from "../../../api.services";

const baseUrl = "PaymentRegister/";

const SentPaymentOrderServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetSentPaymentOrderList`, {
      params: payload
    })
  },

  print(payload) {
    return ApiServices.get(`${baseUrl}PrintSentPaymentOrderList`, {
      params: payload,
      responseType: "blob"
    })
  },

};

export default SentPaymentOrderServices;