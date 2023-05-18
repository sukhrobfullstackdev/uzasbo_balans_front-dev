import ApiServices from "../../../api.services";

const baseUrl = "Contract/";

const ContractsApis = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },
  // deleteDoc(id) {
  //   return ApiServices.delete(`${baseUrl}DeleteDocument?DocumentID=${id}`);
  // },

  // deleteTable(id) {
  //   return ApiServices.delete(`${baseUrl}DeleteTable?DocumentID=${id}`);
  // },

  getById(payload) {
    return ApiServices.get(`${baseUrl}Get`, {
      params: payload
    });
  },

  fillWithLot(payload) {
    return ApiServices.get(`${baseUrl}FillContractSpecificationV2FromLot`, {
      params: payload
    });
  },

  // getTable(id) {
  //   return ApiServices.get(`${baseUrl}GetTable?DocumentID=${id}`);
  // },

  update(data, isClone) {
    return ApiServices.post(`${baseUrl}Update?IsClone=${isClone}`, data);
  },

  // fill(data) {
  //   return ApiServices.post(`${baseUrl}FillTable`, data, {
  //     "headers": {
  //       "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s'
  //     }
  //   });
  // },

  // getTableData(id) {
  //   return ApiServices.get(`${baseUrl}GetTable?DocumentID=${id}`);
  // },

  getHash(id) {
    return ApiServices.get(`${baseUrl}GetSendHash?id=${id}`);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  cancel(id) {
    return ApiServices.post(`${baseUrl}Cancel?id=${id}`);
  },

  // postSignedData(data) {
  //   return ApiServices.post(`${baseUrl}SendSigned`, data);
  // },

  printType(id, type) {
    return ApiServices.get(`${baseUrl}Print?ID=${id}&Type=${type}`,
      { responseType: 'blob' }
    );
  },
};

export default ContractsApis;
