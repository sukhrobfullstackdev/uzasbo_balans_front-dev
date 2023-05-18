import { takeLatest, put, call, all } from "redux-saga/effects";

import { Notification } from "../../../../../../helpers/notifications";
import { getListSuccess, getListFail, getListStartAction } from "./getListSlice";
import PermanentAssetServices from "../../../../../../services/References/Organizational/PremanetAsset/PremanetAsset.services";

export function* getList({ payload }) {
  try {
    const response = yield PermanentAssetServices.getList(payload);
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

export function* PremanetAssetSagas() {
  yield all([call(getListStart)]);
}
