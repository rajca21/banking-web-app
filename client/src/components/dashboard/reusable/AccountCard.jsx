import React from 'react';
import toast from 'react-hot-toast';
import { Coins, DollarSign, Euro, Loader, Minus, Plus } from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { useAccountsStore } from '../../../store/accountStore';

const AccountCard = ({ account, accounts }) => {
  const { user } = useAuthStore();
  const { verifyAccount, isLoading } = useAccountsStore();

  const handleVerify = async () => {
    try {
      await verifyAccount(account._id);
      accounts.map((acc) => {
        if (acc._id === account._id) {
          acc.isVerified = true;
        }
      });
      toast.success('Account verified!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md ${
        account.isVerified
          ? 'hover:scale-105 cursor-pointer bg-white'
          : 'bg-slate-300'
      }`}
    >
      <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
        <div className='flex justify-between'>
          <div>
            <h3 className='text-gray-500 text-md uppercase'>
              {account.currency.code} Account
            </h3>
            <p className='text-2xl'>{account.number}</p>
            {user?.isAdmin && (
              <>
                <p className='text-sm'>
                  {account.user.firstName} {account.user.lastName}
                </p>
                <p className='text-xs text-gray-400'>{account.user.email}</p>
              </>
            )}
          </div>

          {account.currency.code === 'EUR' ? (
            <Euro
              size={30}
              color='#fff'
              className='bg-teal-500 rounded-full p-1'
            />
          ) : account.currency.code === 'USD' ? (
            <DollarSign
              size={30}
              color='#fff'
              className='bg-teal-500 rounded-full p-1'
            />
          ) : (
            <Coins
              size={30}
              color='#fff'
              className='bg-teal-500 rounded-full p-1'
            />
          )}
        </div>
        <div className='flex items-center gap-1 text-sm'>
          {account.balance > 0 ? (
            <span className='text-green-500 flex items-center'>
              <Plus size={18} />
            </span>
          ) : (
            account.balance !== 0 && (
              <span className='text-red-500 flex items-center'>
                <Minus size={18} />
              </span>
            )
          )}

          <div className='w-full flex justify-between items-center gap-5'>
            {account.isVerified ? (
              <span
                className={`${
                  account.balance > 0
                    ? 'text-green-500'
                    : account.balance === 0
                    ? 'text-gray-500'
                    : 'text-red-500'
                }`}
              >
                {' '}
                {account.balance.toFixed(2)} {account.currency.code}
              </span>
            ) : (
              <span>Pending verification</span>
            )}

            {user?.isAdmin && !account.isVerified && (
              <button
                type='button'
                onClick={handleVerify}
                className='hover:scale-105 bg-green-500 px-2 py-1 text-white rounded-md'
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : 'Verify'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
