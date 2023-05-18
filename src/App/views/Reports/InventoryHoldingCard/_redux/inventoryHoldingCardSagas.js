import { takeLatest, put, call, all } from "redux-saga/effects";

import InventoryHoldingCardApis from "../../../../../services/Report/InventoryAccounting/InventoryHoldingCard/InventoryHoldingCardApis";
import { Notification } from "../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield InventoryHoldingCardApis.getList(payload);
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

export function* inventoryHoldingCardSagas() {
  yield all([call(getListStart)]);
}
