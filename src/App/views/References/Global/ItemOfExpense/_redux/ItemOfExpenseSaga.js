import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import ItemOfExpenseServices from "../../../../../../services/References/Global/ItemOfExpense/ItemOfExpense.services";

export function* getList({ payload }) {
  try {
    const response = yield ItemOfExpenseServices.getList(payload);
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

export function* ItemOfExpenseSagas() {
  yield all([call(getListStart)]);
}
