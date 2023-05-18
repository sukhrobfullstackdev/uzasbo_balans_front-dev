import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import OrganizationsDocSettAccount from "../../../../../services/References/Global/OrganizationsDocSettAccount/OrganizationsDocSettAccount.services"

export function* getList({ payload }) {
  try {
    const response = yield OrganizationsDocSettAccount.getList(payload);
    yield put(getListSuccess(response.data));
  } catch (error) {
    Notification('error', error);
    yield put(getListFail(error.response));
  }
  
}

// export function* getSettlmentList({ payload }) {
//   try {
//     const response2 = yield OrganizationsDocSettAccount.getSettlmentList(payload);
//     yield put(getListSuccess( response2.data));
//   } catch (error) {
//     Notification('error', error);
//     yield put(getListFail( error.response2));
//   }
// }

// watcher saga
export function* getListStart() {
  yield takeLatest(getListStartAction, getList);
}

export function* OrganizationsDocSettAccountSagas() {
  yield all([call(getListStart)]);
}
