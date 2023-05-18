import ApiServices from "../../../services/api.services";

const baseUrl = "Role/";

const RoleServices = {

  // get role modules
  getRoleModules(id){
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  // update role
  updateRole(data){
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  // remove role
  removeRole(id){
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  // update Modules Left
  updateModulesLeft(data) {
    return ApiServices.post(`${baseUrl}UpdateModulesLeft`, data);
  },

  // update Modules Left
  updateModulesRight(data) {
    return ApiServices.post(`${baseUrl}UpdateModulesRight`, data);
  },

};

export default RoleServices;