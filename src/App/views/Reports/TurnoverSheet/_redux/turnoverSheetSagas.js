import { takeLatest, put, call, all } from "redux-saga/effects";

import TurnoverSheetApis from "../../../../../services/Report/InventoryAccounting/TurnoverSheet/TurnoverSheetApis";
import { Notification } from "../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield TurnoverSheetApis.getList(payload);
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

export function* turnoverSheetSagas() {
  yield all([call(getListStart)]);
}
