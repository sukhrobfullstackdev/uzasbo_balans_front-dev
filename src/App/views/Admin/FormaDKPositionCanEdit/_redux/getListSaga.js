import { takeLatest, put, call, all } from "redux-saga/effects";

import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import { Notification } from "../../../../../helpers/notifications";
import FormaDKPositionCanEditServices from "../../../../../services/Admin/FormaDKPositionCanEdit/FormaDKPositionCanEdit.services";

export function* getList({ payload }) {
  try {
    const response = yield FormaDKPositionCanEditServices.getList(payload);
    yield put(getListSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getListFail(error.response));
  }
}

// watcher saga
export function* getListStart() {
  yield takeLatest(getListStartAction, getList);
}

export function* FormaDKPositionCanEditSagas() {
  yield all([call(getListStart)]);
}
