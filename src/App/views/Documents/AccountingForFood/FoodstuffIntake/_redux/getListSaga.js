import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import FoodstuffIntakeServices from "../../../../../../services/Documents/AccountingForFood/FoodstuffIntake/FoodstuffIntake.services";

export function* getList({ payload }) {
  try {
    const response = yield FoodstuffIntakeServices.getList(payload);
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

export function* foodstuffIntakeSagas() {
  yield all([call(getListStart)]);
}
