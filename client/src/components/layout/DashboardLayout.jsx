import React from 'react';
import Sidebar from '../dashboard/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className='flex flex-row h-screen w-screen'>
      <div>
        <Sidebar />
      </div>
      <div className='w-full h-full'>
        <div className='overflow-y-scroll h-full bg-gradient-to-br from-gray-900 via-violet-900 to-purple-900'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
