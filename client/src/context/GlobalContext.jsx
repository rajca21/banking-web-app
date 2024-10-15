import React from 'react';

const GlobalContext = React.createContext({
  dashboardView: 'home',
  setDashboardView: () => {},
});

export default GlobalContext;
