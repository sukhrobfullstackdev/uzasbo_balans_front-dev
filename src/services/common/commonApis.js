import ApiServices from '../api.services';

const CommonApis = {
  getList(docUrl, payload) {
    return ApiServices.get(`${docUrl}/GetList`, {
      params: payload
    })
  },
  
  getDocData(docUrl, payload) {
    return ApiServices.get(`${docUrl}/Get`, {
      params: payload
    })
  },
  
  getProfileList(docUrl, payload) {
    return ApiServices.get(`${docUrl}/GetProfileList`, {
      params: payload
    })
  },
  
  clone(docUrl, params) {
    return ApiServices.get(`${docUrl}/Get${params}`)
  },
  
  delete(docUrl, payload) {
    return ApiServices.delete(`${docUrl}/Delete`, {
      params: payload
    })
  },
  
  updateDoc(docUrl, data) {
    return ApiServices.post(`${docUrl}/Update`, data)
  },
  
  get(docUrl, action, payload) {
    return ApiServices.get(`${docUrl}/${action}`, {
      params: payload
    })
  },
  
  post(docUrl, action, data) {
    return ApiServices.post(`${docUrl}/${action}`, data)
  },
}

export default CommonApis;