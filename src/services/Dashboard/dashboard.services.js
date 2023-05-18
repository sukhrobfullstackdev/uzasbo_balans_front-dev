import ApiServices from '../api.services';

const baseUrl = '/Dashboard';

const DashboardServices = {
  getOrganizationDashboardInfo() {
    return ApiServices.get(`${baseUrl}/GetOrganizationsDashboardInfo`);
  },
  getSalaryDashboardInfo() {
    return ApiServices.get(`${baseUrl}/GetSalaryDashboardInfo`);
  },
  getDashboardMinimalSalary() {
    return ApiServices.get(`${baseUrl}/GetDashboardMinimalSalary`);
  }
}

export default DashboardServices;