import { useContext } from 'react';
import GlobalContext from '../context/GlobalContext';

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with loading ContextProvider');
  }
  const { loggedInUser, setLoggedInUser, dashboardView, setDashboardView } =
    context;
  return {
    loggedInUser,
    setLoggedInUser,
    dashboardView,
    setDashboardView,
  };
};
