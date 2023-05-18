import { takeLatest, put, call, all } from "redux-saga/effects";

import IncomeCashOrderServices from '../../../../../../services/Documents/CashAccounting/IncomeCashOrder/IncomeCashOrderservices';
import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield IncomeCashOrderServices.getList(payload);
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

export function* IncomeCashOrderSagas() {
  yield all([call(getListStart)]);
}
