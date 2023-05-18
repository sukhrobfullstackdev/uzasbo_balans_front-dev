import ApiServices from "../../api.services";

const baseUrl = "User/";

const UserServices = {

  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Name=${filter.Name ? filter.Name : ''}&DisplayName=${filter.DisplayName ? filter.DisplayName : ''}
      &State=${filter.State ? filter.State : ''}&OrganizationName=${filter.OrganizationName ? filter.OrganizationName : ''}
      &OrganizationID=${filter.OrganizationID ? filter.OrganizationID : ''}&OrganizationINN=${filterFormValues.OrganizationINN ? filterFormValues.OrganizationINN : ''}`
    );
  },

  //update GET
  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  // get role
  getRole(id) {
    return ApiServices.get(`${baseUrl}GetRole?id=${id}`);
  },

  //getUNS
  getUNS(id) {
    return ApiServices.get(`${baseUrl}GetUNS?id=${id}`);
  },

   //geRegion
   getRegion(id) {
    return ApiServices.get(`${baseUrl}GetRegion?id=${id}`);
  },

  //geSettlement
  getSettlement(id) {
    return ApiServices.get(`${baseUrl}GetSettlement?id=${id}`);
  },

   //geOrg
   getOrg(id) {
    return ApiServices.get(`${baseUrl}GetUserOrg?id=${id}`);
  },

   //geAttachOrg
   getAttachOrg(id) {
    return ApiServices.get(`${baseUrl}GetAttachOrg?id=${id}`);
  },

 //update
  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  //update role
  updateRole(data) {
    return ApiServices.post(`${baseUrl}UpdateRole`, data);
  },

  // update role1
  updateRole1(data) {
    return ApiServices.post(`${baseUrl}UpdateRole1`, data);
  },

  // update UNS
  updateUNS(data) {
    return ApiServices.post(`${baseUrl}UpdateUNS`, data);
  },

  // update UNS1
  updateUNS1(data) {
    return ApiServices.post(`${baseUrl}UpdateUNS1`, data);
  },

   // update Region
   updateRegion(data) {
    return ApiServices.post(`${baseUrl}UpdateRegion`, data);
  },

  // update region1
  updateRegion1(data) {
    return ApiServices.post(`${baseUrl}UpdateRegion1`, data);
  },

   // update settlement
   updateSettlementAccount(data) {
     console.log(data)
    return ApiServices.post(`${baseUrl}UpdateSettlementAccount`, data);
  },

  // update settlement1
  updateSettlementAccount1(data) {
    console.log(data)
    return ApiServices.post(`${baseUrl}UpdateSettlementAccount1`, data);
  },

  // update Org
  updateOrg(data) {
    return ApiServices.post(`${baseUrl}UpdateUserOrg`, data);
  },

  // update Org1
  updateOrg1(data) {
    return ApiServices.post(`${baseUrl}UpdateUserOrg1`, data);
  },

   // update AttachOrg
   updateAttachOrg(data) {
    return ApiServices.post(`${baseUrl}UpdateUserAttachOrg`, data);
  },

  // update AttachOrg1
  updateAttachOrg1(data) {
    return ApiServices.post(`${baseUrl}UpdateUserAttachOrg1`, data);
  },



  // Change EDS Command
  // ChangeEDS(id) {
  //   return ApiServices.get(`${baseUrl}ChangeEDSCommand?SelectedUserID=${id}`);
  // },

  // Create Templates Command
  CreateTemplates(id) {
    return ApiServices.get(`${baseUrl}CreateTemplatesCommand?SelectedUserID=${id}`);
  },
};

export default UserServices;
