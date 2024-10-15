import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.png';

const Landing = () => {
  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      <Link to='/login'>
        <img
          src={logo}
          className='w-full cursor-pointer'
          alt='mobile-banking'
        />
      </Link>
    </div>
  );
};

export default Landing;
