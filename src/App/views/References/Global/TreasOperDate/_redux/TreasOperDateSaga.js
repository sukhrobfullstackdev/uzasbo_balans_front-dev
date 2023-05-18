import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import TreasOperDateServices from "../../../../../../services/References/Global/TreasOperDate/TreasOperDate.services";

export function* getList({ payload }) {
  try {
    const response = yield TreasOperDateServices.getList(payload);
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

export function* TreasOperDates() {
  yield all([call(getListStart)]);
}
