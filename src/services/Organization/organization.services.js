import ApiServices from '../api.services';

const baseUrl = 'Organization/';


const baseOblastUrl = 'Oblast/';
const baseRegionUrl = 'Region/';
const baseStateUrl = 'Helper/';

const OrganizationServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType) {
    if (sortColumn && orderType) {
      if (orderType === 'ascend') {
        orderType = 'asc'
      } else if (orderType === 'descend') {
        orderType = 'desc'
      }
      return ApiServices.get(`${baseUrl}GetList?Search=&SortColumn=${sortColumn}&OrderType=${orderType}&PageNumber=${pageNumber}&PageLimit=${pageLimit}`)
    }
    return ApiServices.get(`${baseUrl}GetList?Search=&SortColumn=&OrderType=&PageNumber=${pageNumber}&PageLimit=${pageLimit}`)
  },
  getByInn(inn) {
    return ApiServices.get(`${baseUrl}Get?id=0&inn=${inn}`)
  },

  getOblastList() {
    return ApiServices.get(`${baseOblastUrl}GetAll?lang=&CountryID=0`)
  },
  
  getRegionList(oblastId) {
    return ApiServices.get(`${baseRegionUrl}GetAll?lang=&OblastID=${oblastId}`)
  },  
  searchList(search) {
    return ApiServices.get(`${baseUrl}GetList?Search=${search}`)
  },
  
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`, id)
  },
  
  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`)
  },
  
  postEdits(data) {
    console.log(data);
    return ApiServices.post(`${baseUrl}Update`, data);
  }

}

export default OrganizationServices;