import React, { Component, Suspense } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
// import Loadable from 'react-loadable';
// import ApiServices from '../services/api.services';
import { BackTop } from 'antd';

import '../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

import Loader from './layout/Loader';
import initialRoutes from "../routes/initial-route";
import './App.css';
import './DarkMode.css';

const AdminLayout = React.lazy(() => import('./layout/AdminLayout'));

class App extends Component {
  componentDidUpdate() {
    if (localStorage.getItem('theme')) {
      document.querySelector('body').classList.add('datta-dark');
    }
  }

  render() {
    const menu = initialRoutes.map((route, index) => {
      return (route.component) ? (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          name={route.name}
          render={props => (
            <route.component {...props} />
          )} />
      ) : (null);
    });

    if (localStorage.getItem('theme')) {
      document.querySelector('body').classList.add('datta-dark')
    }

    return (
      <Suspense fallback={<Loader />}>
        <Switch>
          {menu}
          {/* {this.state.unauthorized && <Redirect to="/auth" exact />} */}
          {localStorage.getItem("token") === null && <Redirect to="/auth" exact />}
          <Route path="/" component={AdminLayout} />
        </Switch>
        <BackTop>
          <div className='back-top'>
            <i className="feather  icon-chevron-up" />
          </div>
        </BackTop>
      </Suspense>
    );
  }
}

export default withRouter(App);
