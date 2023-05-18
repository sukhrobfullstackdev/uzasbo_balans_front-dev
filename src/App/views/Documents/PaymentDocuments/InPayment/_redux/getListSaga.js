import { takeLatest, put, call, all } from "redux-saga/effects";

import InpaymentServices from '../../../../../../services/Documents/PaymentDocuments/Inpayment/Inpayment.services';
import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield InpaymentServices.getList(payload);
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

export function* InpaymentSagas() {
  yield all([call(getListStart)]);
}
