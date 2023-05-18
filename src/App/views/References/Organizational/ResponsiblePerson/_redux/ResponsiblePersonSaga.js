import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import ResponsiblePersonServices from "../../../../../../services/References/Organizational/ResponsiblePerson/ResponsiblePerson.services";

export function* getList({ payload }) {
  try {
    const response = yield ResponsiblePersonServices.getList(payload);
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

export function* ResponsiblePersonSagas() {
  yield all([call(getListStart)]);
}
