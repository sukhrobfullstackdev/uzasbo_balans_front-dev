import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import SpecificationServices from "../../../../../../services/References/Global/Specification/Specification.services";

export function* getList({ payload }) {
  try {
    const response = yield SpecificationServices.getList(payload);
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

export function* SpecificationSagas() {
  yield all([call(getListStart)]);
}
