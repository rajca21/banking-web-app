import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAccountsStore } from '../../../store/accountStore';
import AccountCard from '../reusable/AccountCard';
import AccountModal from '../reusable/modals/AccountModal';

const AccountsView = () => {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { getMyAccounts, isLoading } = useAccountsStore();

  useEffect(() => {
    const fetchMyAccounts = async () => {
      try {
        const res = await getMyAccounts();
        setAccounts(res.accounts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyAccounts();
  }, []);

  if (isLoading) {
    return <Loader color='#fff' size={30} />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col gap-5 min-h-screen items-center justify-center'
      >
        {accounts.map((account, index) => (
          <AccountCard key={index} account={account} />
        ))}

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
          Request new Account
        </motion.button>
      </motion.div>

      {showModal && (
        <AccountModal setShowModal={setShowModal} accounts={accounts} />
      )}
    </>
  );
};

export default AccountsView;
