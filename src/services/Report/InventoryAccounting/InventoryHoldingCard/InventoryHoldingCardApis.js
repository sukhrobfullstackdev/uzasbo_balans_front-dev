import ApiServices from "../../../api.services";

const baseUrl = "Report/";

const InventoryHoldingCardApis = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetInventoryHoldingCardList`, {
      params: payload
    })
  },
  
  print(type, payload) {
    return ApiServices.get(`${baseUrl}${type}`,
      {
        params: payload,
        responseType: 'blob'
      }
    );
  },
};

export default InventoryHoldingCardApis;
