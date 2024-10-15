import React from 'react';

const CurrencyCard = ({ onClick, currency }) => {
  return (
    <div
      onClick={onClick}
      className='w-1/2 bg-white p-3 m-3 rounded-lg shadow-md hover:scale-105 cursor-pointer'
    >
      <div className='flex items-center justify-between px-5 gap-5'>
        <p className='text-sm font-semibold'>{currency.name}</p>

        <h2 className='text-violet-700 font-bold text-2xl'>{currency.code}</h2>
      </div>
    </div>
  );
};

export default CurrencyCard;
