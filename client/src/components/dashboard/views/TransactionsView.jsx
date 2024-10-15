import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { useAccountsStore } from '../../../store/accountStore';
import TransactionCard from '../reusable/TransactionCard';
import TransactionModal from '../reusable/modals/TransactionModal';
import { useTransactionsStore } from '../../../store/transactionStore';
import { ArrowDown, ArrowUp, Loader, Search } from 'lucide-react';
import Input from '../../shared/Input';
import { exportToExcel } from '../../../utils/exportXlsx';

const TransactionsView = () => {
  const [userAccounts, setUserAccounts] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Filters & Search
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');

  // Pagination
  const pageSize = 5;
  const [showMore, setShowMore] = useState(false);

  const { getMyAccounts, isLoading: accountsLoading } = useAccountsStore();
  const { getMyTransactions, isLoading: transactionsLoading } =
    useTransactionsStore();

  const handleShowMore = async () => {
    try {
      const transactionRes = await getMyTransactions(
        userTransactions.length,
        pageSize,
        selectedAccount,
        searchTerm,
        order
      );
      setUserTransactions((prev) => [...prev, ...transactionRes.transactions]);

      if (
        transactionRes.transactions.length + userTransactions.length <
        transactionRes.filtered
      ) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserTransactions = async () => {
    try {
      const transactionRes = await getMyTransactions(
        0,
        pageSize,
        selectedAccount,
        searchTerm,
        order
      );
      setUserTransactions(transactionRes.transactions);

      if (transactionRes.transactions.length < transactionRes.filtered) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const res = await getMyAccounts();
        setUserAccounts(res.accounts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserAccounts();
    fetchUserTransactions();
  }, []);

  // Filter useEffect
  useEffect(() => {
    fetchUserTransactions();
  }, [selectedAccount, searchTerm, order]);

  return (
    <>
      {accountsLoading ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex justify-center gap-10 p-5 items-center'
        >
          <select
            onChange={(e) => {
              if (e.target.value === '0') {
                setSelectedAccount(null);
              } else {
                setSelectedAccount(e.target.value);
              }
            }}
            className='rounded-lg cursor-pointer'
          >
            <option value={0}>All Accounts</option>
            {userAccounts.map((account) => (
              <option value={account._id} key={account._id}>
                {account.number} ({account.currency.code})
              </option>
            ))}
          </select>

          <div className='mt-6'>
            <Input
              icon={Search}
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='text-white'>
            <button
              type='button'
              onClick={() => {
                if (order === 'asc') {
                  setOrder('desc');
                } else {
                  setOrder('asc');
                }
              }}
            >
              {order === 'asc' ? <ArrowDown /> : <ArrowUp />}
            </button>
          </div>
        </motion.div>
      )}
      {transactionsLoading ? (
        <Loader />
      ) : userTransactions.length === 0 ? (
        <div className='w-full flex justify-center my-10 text-2xl font-bold text-red-200'>
          No results!
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className='flex flex-col w-full items-center justify-center'
        >
          {userTransactions.map((transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}

          {showMore && (
            <button
              type='button'
              onClick={handleShowMore}
              className='text-white text-3xl'
            >
              ...
            </button>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='mt-10 bg-violet-700 text-white px-5 py-2 text-xl rounded-lg border-2 border-white hover:border-violet-700 hover:text-violet-700 hover:bg-white'
            type='button'
            onClick={() => {
              setShowModal(true);
            }}
          >
            Make new Payment
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='mt-10 bg-green-800 text-white px-5 py-2 text-xl rounded-lg border-2 border-white hover:border-green-800 hover:text-green-800 hover:bg-white'
            type='button'
            onClick={() => {
              exportToExcel(userTransactions, 'data');
            }}
          >
            Export to Excel
          </motion.button>
        </motion.div>
      )}

      {showModal && (
        <TransactionModal
          setShowModal={setShowModal}
          userAccounts={userAccounts}
          transactions={userTransactions}
        />
      )}
    </>
  );
};

export default TransactionsView;
