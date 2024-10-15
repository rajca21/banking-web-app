import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartCandlestick,
  CircleDollarSign,
  Currency,
  House,
  IdCard,
  LogOut,
  Settings,
} from 'lucide-react';

import logo from '../../assets/logo.png';
import { useGlobalContext } from '../../hooks/useGlobalContext.hook';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const { dashboardView, setDashboardView } = useGlobalContext();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-60 p-3 flex flex-col bg-slate-50 h-screen'>
      <div className='flex items-center gap-2 px-1 py-3'>
        <img src={logo} alt='logo' className='w-10' />
        <span className='font-bold text-2xl'>MBanking</span>
      </div>

      <div className='flex-1 mt-3'>
        <div
          onClick={() => setDashboardView('home')}
          className={`flex gap-2 items-center font-semibold px-3 py-2 cursor-pointer rounded-sm
            ${dashboardView === 'home' && 'bg-violet-800 text-white'}
            hover:bg-purple-600 hover:text-white`}
        >
          <span className='text-xl'>
            <House color='#2e1065' />
          </span>
          Home
        </div>
        {user.isAdmin && (
          <div
            onClick={() => setDashboardView('accounts')}
            className={`flex gap-2 items-center font-semibold px-3 py-2 cursor-pointer rounded-sm
            ${dashboardView === 'accounts' && 'bg-violet-800 text-white'}
            hover:bg-purple-600 hover:text-white`}
          >
            <span className='text-xl'>
              <IdCard color='#2e1065' />
            </span>
            Accounts
          </div>
        )}
        {!user.isAdmin && (
          <div
            onClick={() => setDashboardView('transactions')}
            className={`flex gap-2 items-center font-semibold px-3 py-2 cursor-pointer rounded-sm
            ${dashboardView === 'transactions' && 'bg-violet-800 text-white'}
            hover:bg-purple-600 hover:text-white`}
          >
            <span className='text-xl'>
              <CircleDollarSign color='#2e1065' />
            </span>
            Transactions
          </div>
        )}
        {user.isAdmin && (
          <div
            onClick={() => setDashboardView('currencies')}
            className={`flex gap-2 items-center font-semibold px-3 py-2 cursor-pointer rounded-sm
            ${dashboardView === 'currencies' && 'bg-violet-800 text-white'}
            hover:bg-purple-600 hover:text-white`}
          >
            <span className='text-xl'>
              <Currency color='#2e1065' />
            </span>
            Currencies
          </div>
        )}
        <div
          onClick={() => setDashboardView('converter')}
          className={`flex gap-2 items-center font-semibold px-3 py-2 cursor-pointer rounded-sm
            ${dashboardView === 'converter' && 'bg-violet-800 text-white'}
            hover:bg-purple-600 hover:text-white`}
        >
          <span className='text-xl'>
            <ChartCandlestick color='#2e1065' />
          </span>
          Converter
        </div>
      </div>

      <div>
        <div
          onClick={() => handleLogout()}
          className='flex gap-2 items-center font-semibold px-3 py-2 cursor-pointer rounded-sm hover:bg-purple-600 hover:text-white'
        >
          <span className='text-xl'>
            <LogOut color='#2e1065' />
          </span>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
