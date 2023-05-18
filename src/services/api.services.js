import axios from 'axios';

const ApiServices = axios.create({
  baseURL: 'https://main-api.uzasbo.uz/',
  //  baseURL: 'https://maintest-api.uzasbo.uz/',
  //  baseURL: 'http://localhost:9454/',
  // baseURL: 'http://zp-api.uzasbo.uz/',
  // baseURL: 'https://main-api.uzasbo.uz/',
   // baseURL: 'http://localhost:9554/',
  headers: {
    'Content-Type': 'application/json',
  }
});

// if (window.location.href.includes('http://zp.uzasbo.uz')) {
//   ApiServices.defaults.baseURL = 'http://zp-api.uzasbo.uz/';
// } else if (window.location.href.includes('https://zp.uzasbo.uz')) {
//   ApiServices.defaults.baseURL = 'https://zp-api.uzasbo.uz/';
// } else if (window.location.href.includes('http://zptest.uzasbo.uz')) {
//   ApiServices.defaults.baseURL = 'http://apistest.uzasbo.uz/';
// } else if (window.location.href.includes('https://zptest.uzasbo.uz')) {
//   ApiServices.defaults.baseURL = 'https://apistest.uzasbo.uz/';
// }
  
ApiServices.interceptors.request.use(function (config) {
  let token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = ["Bearer", token].join(" ");
  }
  return config;
}, function (error) {
  if (error && error.response && error.response.data && error.response.data.error) {
    return Promise.reject(error.response.data.error);
  } else {
    return Promise.reject(error);
  }
});

ApiServices.interceptors.response.use(res => res, error => {
  if (error && error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/auth';
  }

  if (error && error.response && error.response.data && error.response.data.error) {
    return Promise.reject(error.response.data.error);
  } else {
    return Promise.reject(error);
  }
});

export default ApiServices;

