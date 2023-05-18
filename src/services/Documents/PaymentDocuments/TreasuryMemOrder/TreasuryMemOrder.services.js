import ApiServices from "../../../api.services";

const baseUrl = "TreasuryMemOrder/";

const TreasuryMemOrderServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  getById(slug) {
    return ApiServices.get(`${baseUrl}Get${slug}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
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
  prepareForSend(id) {
    return ApiServices.post(`${baseUrl}PrepareForSend?id=${id}`);
  },
  changeSubAcc(id, SubAccDbID) {
    return ApiServices.post(`${baseUrl}ChangeSubAcc?id=${id}&SubAccDbID=${SubAccDbID}`);
  },
  changeFinYear(id) {
    return ApiServices.get(`${baseUrl}ChangeFinYear?id=${id}}`);
  },
  printType(id, page) {
    return ApiServices.get(`${baseUrl}Print?ID=${id}&Page=${page}`,
      { responseType: 'blob' }
    );
  },

};

export default TreasuryMemOrderServices;