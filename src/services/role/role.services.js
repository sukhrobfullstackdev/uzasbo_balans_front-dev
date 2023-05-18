import ApiServices from '../api.services';

const baseUrl = 'Role/';
const baseStateUrl = 'Helper/';

const RoleServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, search) {
    if (orderType === 'ascend') {
      orderType = 'asc'
    } else if (orderType === 'descend') {
      orderType = 'desc'
    }
    return ApiServices.get(`${baseUrl}GetList?Search=${search ? search : ``}&SortColumn=${sortColumn ? sortColumn : ``}&OrderType=${orderType ? orderType : ``}&PageNumber=${pageNumber}&PageLimit=${pageLimit}`)
  },

  getModuleList() {
    return ApiServices.get(`Helper/GetModuleList`)
  },

  postRole(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`, id)
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`)
  },
}
export default RoleServices;