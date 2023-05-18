import ApiServices from "../../../api.services";

const baseUrl = "Report/";

const TurnoverSheetApis = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetTotalAccountBookIH`, {
      params: payload
    })
  },
  // deleteDoc(id) {
  //   return ApiServices.delete(`${baseUrl}DeleteDocument?DocumentID=${id}`);
  // },

  // deleteTable(id) {
  //   return ApiServices.delete(`${baseUrl}DeleteTable?DocumentID=${id}`);
  // },

  print(type, payload) {
    return ApiServices.get(`${baseUrl}${type}`,
      {
        params: payload,
        responseType: 'blob'
      }
    );
  },
};

export default TurnoverSheetApis;
