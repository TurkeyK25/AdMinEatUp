import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from '../components/ProtectedRoute';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Icons = Loadable(lazy(() => import('../views/icons/Icons')))
const Statistics = Loadable(lazy(() => import('../views/statistics/Statistics')))
const MenuManagement = Loadable(lazy(() => import('../views/menu/MenuManagement')))
const UserManagement = Loadable(lazy(() => import('../views/user-management/UserManagement')))
const Restaurants = Loadable(lazy(() => import('../views/restaurants/Restaurants')))
const Vouchers = Loadable(lazy(() => import('../views/vouchers/Vouchers')))
const Orders = Loadable(lazy(() => import('../views/orders/Orders')))
const Settings = Loadable(lazy(() => import('../views/settings/Settings')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('../views/authentication/ResetPassword')));

const Router = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/statistics', exact: true, element: <Statistics /> },
      { path: '/menu', exact: true, element: <MenuManagement /> },
      { path: '/user-management', exact: true, element: <UserManagement /> },
      { path: '/restaurants', exact: true, element: <Restaurants /> },
      { path: '/vouchers', exact: true, element: <Vouchers /> },
      { path: '/orders', exact: true, element: <Orders /> },
      { path: '/settings', exact: true, element: <Settings /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />
  },
  {
    path: 'reset-password',
    element: <ResetPassword />
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
