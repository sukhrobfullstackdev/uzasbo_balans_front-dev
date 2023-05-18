import ApiServices from "../../../api.services";

const baseUrl = "OrganizationsDocSettAccount/";
const baseUrl2 = "OrganizationsSettlementAccount/";

const OrganizationsDocSettAccountServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload

    })
  },

  getSettlmentList(filterFormValues) {
    // console.log(filterFormValues)
    // if (orderType === "ascend") {
    //   orderType = "asc";
    // } else if (orderType === "descend") {
    //   orderType = "desc";
    // }
    return ApiServices.get(`${baseUrl2}GetParentAttachedSettAccountList?&Search=${filterFormValues}&PageNumber=1&PageLimit=10`)
  },
  
  getNoSettlmentList(filterFormValues) {
    // console.log(filterFormValues)
    // if (orderType === "ascend") {
    //   orderType = "asc";
    // } else if (orderType === "descend") {
    //   orderType = "desc";
    // }
    return ApiServices.get(`${baseUrl2}GetParentNotAttachedSettAccountList?&Search=${filterFormValues}&PageNumber=1&PageLimit=10`)
  },


  getById(id) {
    return ApiServices.get(`${baseUrl}Get?organizationID=${id}`);
  },

  getTableList(id, data) {
    console.log(id, data)
    return ApiServices.get(`${baseUrl}GetTableList?organizationID=${id}&Search=${data ? data: ""}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

};

export default OrganizationsDocSettAccountServices;