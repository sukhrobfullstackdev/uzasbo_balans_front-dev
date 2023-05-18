import React from 'react';

const MainPage = React.lazy(() => import('../App/views/MainPage/MainPage'))
//Adminstrator

const routes = [
  //dashboard
  { path: '/dashboard/default', exact: true, name: 'Default', component: MainPage, role: 'Dashboard' },
]


export default routes;

