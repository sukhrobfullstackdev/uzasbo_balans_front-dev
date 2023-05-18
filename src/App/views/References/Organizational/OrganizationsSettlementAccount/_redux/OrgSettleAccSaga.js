import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import OrgSettleAccServices from "../../../../../../services/References/Organizational/OrgSettleAcc/OrgSettleAcc.services";

export function* getList({ payload }) {
  try {
    const response = yield OrgSettleAccServices.getList(payload);
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

export function* OrgSettleAccSagas() {
  yield all([call(getListStart)]);
}
