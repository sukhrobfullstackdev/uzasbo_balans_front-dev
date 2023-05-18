import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import InventoryHoldingServices from "../../../../../../services/References/Organizational/InventoryHolding/InventoryHolding.services";

export function* getList({ payload }) {
  try {
    const response = yield InventoryHoldingServices.getList(payload);
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

export function* InventoryHoldingSagas() {
  yield all([call(getListStart)]);
}
