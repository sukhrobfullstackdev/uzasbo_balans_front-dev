import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { rootReducer } from "./rootReducer";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: false,
  }),
  sagaMiddleware
];

const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export default store;
