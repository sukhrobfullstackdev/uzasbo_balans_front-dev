import { takeLatest, put, call, all } from "redux-saga/effects";

import ApiServices from '../../../../../services/api.services';
import { getListSuccess, getListFail, getListStartAction } from "./usersSlice";

export function* getUserList({ payload }) {
  try {
    const response = yield ApiServices.get("User/GetList", {
      params: payload
    });
    yield put(getListSuccess(response.data));
  } catch (error) {
    yield put(getListFail(error.response));
  }
}

// watcher saga
export function* getUserListStart() {
  yield takeLatest(getListStartAction, getUserList);
}

export function* userListSagas() {
  yield all([call(getUserListStart)]);
}
