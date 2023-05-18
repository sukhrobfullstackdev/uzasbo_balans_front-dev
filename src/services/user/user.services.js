import ApiServices from '../api.services';

const baseUrl = 'Account/';
const baseStateUrl = 'Helper/';
// const baseRegionUrl = 'Region/';

const UserServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, search) {
    if (orderType === 'ascend') {
      orderType = 'asc'
    } else if (orderType === 'descend') {
      orderType = 'desc'
    }
    return ApiServices.get(`${baseUrl}GetList?Search=${search ? search : ``}&SortColumn=${sortColumn ? sortColumn : ``}&OrderType=${orderType ? orderType : ``}&PageNumber=${pageNumber}&PageLimit=${pageLimit}`)
  },
  getRoleList() {
    return ApiServices.get(`${baseStateUrl}GetRoleList`)
  },
  getOrgList() {
    return ApiServices.get(`Organization/GetAll`)
  },
  getUser(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`)
  },
  postUser(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
  changePwd(data) {
    console.log(data);
    return ApiServices.post(`${baseUrl}ChangePassword`, data);
  },
  logout() {
    // console.log(data);
    return ApiServices.post(`${baseUrl}LogOut`);
  }
  // getRegionList(oblastId) {
  //   return ApiServices.get(`${baseRegionUrl}GetAll?lang=&OblastID=${oblastId}`)
  // },

  // getByInn(inn) {
  //   return ApiServices.get(`${baseUrl}Get?id=0&inn=${inn}`)
  // },

  // delete(id) {
  //   return ApiServices.delete(`${baseUrl}Delete?id=${id}`, id)
  // },

  // getById(id) {
  //   return ApiServices.get(`${baseUrl}Get?id=${id}`)
  // },


}

export default UserServices;