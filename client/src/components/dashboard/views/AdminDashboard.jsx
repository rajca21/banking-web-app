import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi';
import { BsBank } from 'react-icons/bs';
import { GrTransaction } from 'react-icons/gr';

import { useUsersStore } from '../../../store/userStore';
import { useTransactionsStore } from '../../../store/transactionStore';
import { useAccountsStore } from '../../../store/accountStore';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const { getUsers, isLoading: usersLoading } = useUsersStore();
  const { getTransactions, isLoading: transactionsLoading } =
    useTransactionsStore();
  const { getAccounts, isLoading: accountsLoading } = useAccountsStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getUsers();
        setUsers(userRes.users);
        const transactionRes = await getTransactions();
        setTransactions(transactionRes.transactions);
        const accountRes = await getAccounts();
        setAccounts(accountRes.accounts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='p-3 md:mx-auto'>
      <h2 className='text-center text-4xl font-bold text-white my-20'>
        Admin Dashboard Overview
      </h2>
      <div className='flex flex-col items-center gap-4 justify-center'>
        {usersLoading ? (
          <Loader />
        ) : (
          <div className='flex flex-col p-3 bg-slate-50 gap-4 md:w-72 w-full rounded-md shadow-md'>
            <div className='flex justify-between'>
              <div>
                <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                <p className='text-2xl'>{users?.length}</p>
              </div>
              <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
                <HiArrowNarrowUp />
                {parseInt(users?.length / 2) + 1}
              </span>
              <div className='text-gray-500'>Last month</div>
            </div>
          </div>
        )}

        {accountsLoading ? (
          <Loader />
        ) : (
          <div className='flex flex-col p-3 bg-slate-50 gap-4 md:w-72 w-full rounded-md shadow-md'>
            <div className='flex justify-between'>
              <div>
                <h3 className='text-gray-500 text-md uppercase'>
                  Total Accounts
                </h3>
                <p className='text-2xl'>{accounts?.length}</p>
              </div>
              <BsBank className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
                <HiArrowNarrowUp />
                {parseInt(accounts?.length / 2) + 1}
              </span>
              <div className='text-gray-500'>Last month</div>
            </div>
          </div>
        )}

        {transactionsLoading ? (
          <Loader />
        ) : (
          <div className='flex flex-col p-3 bg-slate-50 gap-4 md:w-72 w-full rounded-md shadow-md'>
            <div className='flex justify-between'>
              <div>
                <h3 className='text-gray-500 text-md uppercase'>
                  Total Transactions
                </h3>
                <p className='text-2xl'>{transactions?.length}</p>
              </div>
              <GrTransaction className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
            </div>
            <div className='flex gap-2 text-sm'>
              <span className='text-green-500 flex items-center'>
                <HiArrowNarrowUp />
                {parseInt(transactions?.length / 2) + 1}
              </span>
              <div className='text-gray-500'>Last month</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
