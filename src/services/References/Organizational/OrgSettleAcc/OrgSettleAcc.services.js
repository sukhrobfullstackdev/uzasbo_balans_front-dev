
import ApiServices from "../../../api.services";

const baseUrl = "OrganizationsSettlementAccount/";

const OrgSettleAccServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },
  getParentAttachedSettAccountList(payload) {
    return ApiServices.get(`${baseUrl}GetParentAttachedSettAccountList`, {
      params: payload  
    })
  },

  getParentNotAttachedSettAccountList(payload) {
    return ApiServices.get(`${baseUrl}GetParentNotAttachedSettAccountList`, {
      params: payload
    })
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  attachSubAcc(){
    return ApiServices.post(`${baseUrl}AutoAttachSubAccToSettlement`);
  }

};

export default OrgSettleAccServices;