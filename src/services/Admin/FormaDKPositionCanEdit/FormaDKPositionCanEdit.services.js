import ApiServices from "../../api.services";

const baseUrl = "FormaDKPositionCanEdit/";

const FormaDKPositionCanEditServices = {

    getList(payload) {
        return ApiServices.get(`${baseUrl}GetList`, { params: payload });
    },

    getById(id) {
        return ApiServices.get(`${baseUrl}Get?id=${id}`);
    },

    update(data) {
        return ApiServices.post(`${baseUrl}Update`, data);
    },

    FillFormaDKPositionCanEdit() {
        return ApiServices.get(`${baseUrl}FillFormaDKPositionCanEdit`);
    },

};

export default FormaDKPositionCanEditServices;
