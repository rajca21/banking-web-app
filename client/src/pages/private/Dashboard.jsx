import React from 'react';

import { useGlobalContext } from '../../hooks/useGlobalContext.hook';
import HomeView from '../../components/dashboard/views/HomeView';
import TransactionsView from '../../components/dashboard/views/TransactionsView';
import CurrenciesView from '../../components/dashboard/views/CurrenciesView';
import ConverterView from '../../components/dashboard/views/ConverterView';
import AdminAccountsView from '../../components/dashboard/views/AdminAccountsView';

const Dashboard = () => {
  const { dashboardView } = useGlobalContext();

  return (
    <>
      {dashboardView === 'home' && <HomeView />}
      {dashboardView === 'transactions' && <TransactionsView />}
      {dashboardView === 'currencies' && <CurrenciesView />}
      {dashboardView === 'converter' && <ConverterView />}
      {dashboardView === 'accounts' && <AdminAccountsView />}
    </>
  );
};

export default Dashboard;
