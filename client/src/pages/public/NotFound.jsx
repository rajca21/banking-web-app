import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
      <div className='mx-auto max-w-screen-sm text-center'>
        <h1 className='mb-4 mt-40 text-7xl tracking-tight font-extrabold lg:text-9xl text-slate-50'>
          404
        </h1>
        <p className='mb-4 text-3xl tracking-tight font-bold text-gray-100 md:text-4xl'>
          Page not Found
        </p>
        <p className='mb-40 text-lg font-light text-gray-400'>
          Sorry, we can't find that page. You'll find lots to explore on the{' '}
          <span
            className='underline cursor-pointer'
            onClick={() => {
              navigate('/dashboard');
            }}
          >
            home page.
          </span>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
