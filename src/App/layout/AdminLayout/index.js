import React, { Suspense, useCallback, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import Loader from "../Loader";
import NotFound from "../../views/NotFound/NotFound";
import Calendar from "../../views/NotFound/Calendar";
import mainRoutes from "../../../routes/main-routes";
import adminRoutes from "../../../routes/admin-routes";
import dashboardRoutes from "../../../routes/dashboard-routes";
import './app.scss';
import { collapseMenu } from '../../../store/navigation-slice';
import useWindowSize from '../../../hooks/useWindowSize';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigation = useSelector(state => state.navigation);
  const layout = navigation.layout;
  const collapseMn = navigation.collapseMenu;
  const defaultPath = navigation.defaultPath;
  const windowWidth = useWindowSize().width;
  const roles = JSON.parse(localStorage.getItem('userInfo'))?.Roles

  useEffect(() => {
    if (windowWidth > 992 && windowWidth <= 1024 && layout !== 'horizontal') {
      dispatch(collapseMenu())
    }
  }, [windowWidth]);

  const mobileOutClickHandler = useCallback(() => {
    if (windowWidth < 992 && collapseMn) {
      dispatch(collapseMenu())
    }
  }, [windowWidth])

  let routeItems = mainRoutes;
  if (roles.includes('UserView')) {
    routeItems = adminRoutes;
  }  else if (roles.includes('Dashboard')){
    routeItems = dashboardRoutes;
  }

  const filteredRoutes = routeItems.filter(item => {
    return (roles.includes(item.role));
  });

  const menu = filteredRoutes.map((route, index) => {
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

  return (
    <>
      <Navigation />
      <NavBar />
      
      <div className="pcoded-main-container" onClick={() => mobileOutClickHandler}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <Breadcrumb />
              <div className="main-body">
                <div className="page-wrapper">
                  
                  <Suspense  fallback={<Loader />}>
                    <Switch> 
                      {menu}
                      <Redirect exact from="/" to={defaultPath} />                      
                   
                      <Route ><NotFound /></Route>
                    </Switch>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;