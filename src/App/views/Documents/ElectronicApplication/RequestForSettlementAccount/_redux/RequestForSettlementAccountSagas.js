import { takeLatest, put, call, all } from "redux-saga/effects";

import CommonApis from "../../../../../../services/common/commonApis";
import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield CommonApis.getList('RequestForSettlementAccount', payload);
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

export function* RequestForSettlementAccountSagas() {
  yield all([call(getListStart)]);
}
