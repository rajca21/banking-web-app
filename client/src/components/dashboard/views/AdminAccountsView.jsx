import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAccountsStore } from '../../../store/accountStore';
import { useUsersStore } from '../../../store/userStore';
import { useCurrenciesStore } from '../../../store/currencyStore';
import AccountCard from '../reusable/AccountCard';

const AdminAccountsView = () => {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const { getAccounts, isLoading } = useAccountsStore();
  const { getUsers, isLoading: loadingUsers } = useUsersStore();
  const { getCurrencies, isLoading: loadingCurrencies } = useCurrenciesStore();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await getAccounts(selectedUser, selectedCurrency);
        setAccounts(res.accounts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccounts();
  }, [selectedUser, selectedCurrency]);

  useEffect(() => {
    const fetchUsersAndCurrencies = async () => {
      try {
        const userRes = await getUsers();
        setUsers(userRes.users);
        const currencyRes = await getCurrencies();
        setCurrencies(currencyRes.currencies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsersAndCurrencies();
  }, []);

  return (
    <>
      {isLoading || loadingCurrencies || loadingUsers} ? <></> :{' '}
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className='flex justify-between p-5 items-center'
        >
          <select
            onChange={(e) => {
              if (e.target.value === '0') {
                setSelectedUser(null);
              } else {
                setSelectedUser(e.target.value);
              }
            }}
            className='rounded-lg cursor-pointer'
          >
            <option value={0}>All Users</option>
            {users.map((user) => (
              <option value={user._id} key={user._id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => {
              if (e.target.value === '0') {
                setSelectedCurrency(null);
              } else {
                setSelectedCurrency(e.target.value);
              }
            }}
            className='rounded-lg cursor-pointer'
          >
            <option value={0}>All Currencies</option>
            {currencies.map((currency) => (
              <option value={currency._id} key={currency._id}>
                {currency.code}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-wrap gap-5 mt-20 items-center justify-center'
        >
          {accounts.length === 0 ? (
            <div className='text-red-300 text-2xl'>No Accounts Found</div>
          ) : (
            <>
              {accounts.map((account) => (
                <AccountCard
                  key={account._id}
                  account={account}
                  accounts={accounts}
                  setAccounts={setAccounts}
                />
              ))}
            </>
          )}
        </motion.div>
      </>
    </>
  );
};

export default AdminAccountsView;
