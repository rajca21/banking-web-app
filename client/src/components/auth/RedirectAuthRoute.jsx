import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../../store/authStore';

const RedirectAuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

export default RedirectAuthRoute;
