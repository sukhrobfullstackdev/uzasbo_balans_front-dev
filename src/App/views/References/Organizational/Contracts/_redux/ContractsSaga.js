import { takeLatest, put, call, all } from "redux-saga/effects";

import ContractsApis from '../../../../../../services/References/Organizational/Contracts/Contracts';
import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";

export function* getList({ payload }) {
  try {
    const response = yield ContractsApis.getList(payload);
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

export function* ContractsSagas() {
  yield all([call(getListStart)]);
}
