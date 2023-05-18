import ApiServices from "../../../api.services";

const baseUrl = "Report/";

const AccountBookByEmployeeServices = {
  GetAccountBookByEmployee(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetAccountBookByEmployee?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&StartDate=${date.StartDate}&EndDate=${date.EndDate}`);
  },

  postDataFillTableData(data) {
    return ApiServices.post(`${baseUrl}FillReport`, data);
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`, id);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postTableData(data) {
    return ApiServices.post(`${baseUrl}CalculateReportSum?Calculate=true`, data);
  },
  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
};

export default AccountBookByEmployeeServices;
