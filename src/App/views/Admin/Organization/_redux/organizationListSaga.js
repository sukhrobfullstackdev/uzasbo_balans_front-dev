import {takeLatest, put, call, all} from "redux-saga/effects";
import ApiServices from "../../../../../services/api.services";
import {getListSuccess, getListFail, getListStartAction} from "./organizationsSlice";
// import {ShowNotification} from "../../../containers/ShowNotification";

// worker saga
export function* getOrganizationList({payload}) {
    try {
        const response = yield ApiServices.get("Organization/GetList", {
            params: payload
        });
        // console.log(response);
        yield put(getListSuccess(response.data));
    } catch (error) {
        // ShowNotification(
        //     "error",
        //     `${error.response.statusText}`,
        //     `${error.response.data.error}`
        // );
        yield put(getListFail(error.response));
    }
}

// watcher saga
export function* getOrganizationListStart() {
    yield takeLatest(getListStartAction, getOrganizationList);
}

export function* organizationListSagas() {
    yield all([call(getOrganizationListStart)]);
}
