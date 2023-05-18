import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
// import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Spin, ConfigProvider } from 'antd';

import './i18next';
import App from './App/index';
import * as serviceWorker from './serviceWorker';
// import reducer from './store/reducer';
import config from './config';
import "antd/dist/antd.min.css";
import locale from 'antd/lib/locale/ru_RU';
import 'moment/locale/ru';
import store from "./store/store";
// const store = createStore(reducer,  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const app = (
  <Suspense
    fallback={(
      <div className="loader-wrapper">
        <Spin />
      </div>
    )}
  >
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
        <ConfigProvider locale={locale}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </Suspense>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
// serviceWorker.register();
