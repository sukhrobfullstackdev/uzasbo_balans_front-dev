import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import ConstantValueServices from "../../../../../../services/References/Organizational/ConstantValue/ConstantValue.services";

export function* getList({ payload }) {
  try {
    const response = yield ConstantValueServices.getList(payload);
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

export function* ConstantValueSagas() {
  yield all([call(getListStart)]);
}
