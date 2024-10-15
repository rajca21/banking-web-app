import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '../../store/authStore';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { pathname } = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user.isVerified) {
    return <Navigate to={`/verify-email/${user.email}`} replace />;
  }

  if (!user.userPin && pathname !== '/pin') {
    return <Navigate to='/pin' replace />;
  }

  if (user.userPin && pathname === '/pin') {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

export default PrivateRoute;
