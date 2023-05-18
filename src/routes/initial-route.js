import React from 'react';

// const SignUp1 = React.lazy(() => import('./Demo/Authentication/SignUp/SignUp1'));
const Signin = React.lazy(() => import('../App/views/Authentication/SignIn/SignIn'));
// const NotFound = React.lazy(() => import('./App/views/NotFound/NotFound'));

const route = [
  // { path: '/auth/signup-1', exact: true, name: 'Signup 1', component: SignUp1 },
  { path: '/auth', exact: true, name: 'Signin', component: Signin },
  // { path: '*', name: 'Not found', exact: true, component: NotFound },
];

//

export default route;