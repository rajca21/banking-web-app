import React from 'react';

import { useAuthStore } from '../../../store/authStore';
import AccountsView from './AccountsView';
import LoadingSpinner from '../../shared/LoadingSpinner';
import AdminDashboard from './AdminDashboard';

const HomeView = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{user.isAdmin ? <AdminDashboard /> : <AccountsView />}</>;
};

export default HomeView;
