import { takeLatest, put, call, all } from "redux-saga/effects";

import CurrencyIncomeCashOrderServices from '../../../../../../services/Documents/CashAccounting/CurrencyIncomeCashOrder/CurrencyIncomeCashOrderservices';
import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield CurrencyIncomeCashOrderServices.getList(payload);
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

export function* CurrencyIncomeCashOrderSagas() {
  yield all([call(getListStart)]);
}
