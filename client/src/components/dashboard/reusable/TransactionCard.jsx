import React from 'react';

import { useAuthStore } from '../../../store/authStore';

const TransactionCard = ({ transaction }) => {
  const { user } = useAuthStore();

  return (
    <>
      {user && (
        <div className='w-1/2 bg-white p-3 m-3 rounded-lg shadow-md hover:scale-105 cursor-pointer'>
          <div className='flex items-center justify-between px-5 gap-5'>
            <div className='flex flex-col'>
              <p className='text-xs'>Transaction #{transaction._id}</p>

              {user._id === transaction.userSender && (
                <span className='text-sm font-semibold'>
                  To: {transaction.accountReceiver.user.firstName}{' '}
                  {transaction.accountReceiver.user.lastName} (
                  {transaction.accountReceiver.number})
                </span>
              )}

              {user._id === transaction.userReceiver && (
                <span className='text-sm font-semibold'>
                  From: {transaction.accountSender.user.firstName}{' '}
                  {transaction.accountSender.user.lastName} (
                  {transaction.accountSender.number})
                </span>
              )}

              <p className='text-md font-semibold'>{transaction.description}</p>
              <p className='text-xs font-semibold'>
                {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>

            {transaction.isInternal ? (
              <h2 className='text-gray-700 font-bold text-2xl'>
                {transaction.receiverAmount.toFixed(2)}{' '}
                {transaction.accountReceiver.currency.code} (internal)
              </h2>
            ) : (
              <>
                {user._id === transaction.userSender && (
                  <h2 className='text-red-700 font-bold text-2xl'>
                    {transaction.senderAmount.toFixed(2)}{' '}
                    {transaction.accountSender.currency.code}
                  </h2>
                )}
                {user._id === transaction.userReceiver && (
                  <h2 className='text-green-700 font-bold text-2xl'>
                    {transaction.receiverAmount.toFixed(2)}{' '}
                    {transaction.accountReceiver.currency.code}
                  </h2>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionCard;
