import ApiServices from "../../api.services";

const baseUrl = "ChangeDocumentStatus/";

const ChangeDocStatusServices = {

  // get list
  getList(params) {
    return ApiServices.get(`${baseUrl}GetList`, params);
  },

  // get document
  getDocument(id) {
    return ApiServices.get(`${baseUrl}Get?ID=${id}`);
  },

  // update document
  updateDocument(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  // get document
  acceptDocument(id) {
    return ApiServices.post(`${baseUrl}Accept?ID=${id}`);
  },

};

export default ChangeDocStatusServices;