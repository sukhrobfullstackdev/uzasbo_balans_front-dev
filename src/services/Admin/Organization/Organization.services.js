import ApiServices from "../../api.services";

const baseUrl = "Organization/";

const OrganizationServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, filter) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&INN=${filter.INN ? filter.INN : ''}&Search=${filter.Search ? filter.Search : ''}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`, id);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },
  
  userJobCleaner(id) {
    return ApiServices.get(`${baseUrl}UserJobCleaner?OrganizationID=${id}`);
  },
  organizationRestriction(id) {
    return ApiServices.get(`${baseUrl}RestrictionOrganization=${id}`);
  },

  calculate(data) {
    return ApiServices.post(`${baseUrl}Calculate`, data); 
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  postDataRecalcAccAccountBookOrganization(data) {
    return ApiServices.post(`${baseUrl}RecalcAccAccountBookOrganization?BeginDate=${data.BeginDate}&EndDate=${data.EndDate}`);
  },

  postFillData(data) {
    return ApiServices.post(`${baseUrl}FillOrganizationSettings`, data);
  },
};

export default OrganizationServices;
