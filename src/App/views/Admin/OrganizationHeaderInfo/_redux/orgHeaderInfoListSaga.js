import {takeLatest, put, call, all} from "redux-saga/effects";
import { Notification } from "../../../../../helpers/notifications";
import ApiServices from "../../../../../services/api.services";
import {getListSuccess, getListFail, getListStartAction} from "./orgHeaderInfoSlice";

// worker saga
export function* getOrgHeaderInfoList({payload}) {
    try {
        const response = yield ApiServices.get("OrganizationHeaderInfo/GetList", {
            params: payload
        });
        yield put(getListSuccess(response.data));
    } catch (error) {
        Notification('error', error);
        yield put(getListFail(error.response));
    }
}

// watcher saga
export function* getOrgHeaderInfoListStart() {
    yield takeLatest(getListStartAction, getOrgHeaderInfoList);
}

export function* orgHeaderInfoListSagas() {
    yield all([call(getOrgHeaderInfoListStart)]);
}
