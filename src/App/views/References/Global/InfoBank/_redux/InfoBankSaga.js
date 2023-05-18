import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import InfoBankServices from "../../../../../../services/References/Global/InfoBank/InfoBank.services";

export function* getList({ payload }) {
  try {
    const response = yield InfoBankServices.getList(payload);
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

export function* InfoBankSagas() {
  yield all([call(getListStart)]);
}
