import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Banknote, Code, Loader, Text, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuthStore } from '../../../../store/authStore';
import { useAccountsStore } from '../../../../store/accountStore';
import { useTransactionsStore } from '../../../../store/transactionStore';
import { calculateAmounts } from '../../../../utils/transactionUtils';
import Input from '../../../shared/Input';

const TransactionModal = ({ setShowModal, userAccounts, transactions }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState('');
  const [pinCode, setPinCode] = useState('');

  const { user } = useAuthStore();
  const {
    getAccountByNumber,
    getAccountById,
    isLoading: accountLoading,
  } = useAccountsStore();
  const { createMyTransaction, isLoading: transactionLoading } =
    useTransactionsStore();

  const handleMakePayment = async (e) => {
    e.preventDefault();

    // Check all Fields
    if (!selectedAccount || selectedAccount === '0') {
      toast.error('Please select Account!');
      return;
    }
    if (receiverAccount.trim() === '') {
      toast.error('Please provide receiver account number!');
      return;
    }
    if (!amount || amount === 0) {
      toast.error('Please provide payment amount!');
      return;
    }
    if (description.trim() === '') {
      toast.error('Please provide payment description!');
      return;
    }
    if (pinCode.trim() === '') {
      toast.error('Please provide your accounts pin code!');
      return;
    }

    try {
      // Check Pin Code
      if (user.userPin !== pinCode) {
        toast.error('Wrong pin code!');
        return;
      }

      // Check if Receiver Account Exists
      const receiverAccountRes = await getAccountByNumber(receiverAccount);
      if (selectedAccount === receiverAccountRes.account._id) {
        toast.error('Same accounts!');
        return;
      }
      const senderAccountRes = await getAccountById(selectedAccount);

      // Amounts
      const amounts = calculateAmounts(
        senderAccountRes.account,
        receiverAccountRes.account,
        parseFloat(amount)
      );

      const transRes = await createMyTransaction({
        userReceiver: receiverAccountRes.account.user._id,
        accountSender: senderAccountRes.account._id,
        accountReceiver: receiverAccountRes.account._id,
        description,
        senderAmount: amounts.senderAmount,
        receiverAmount: amounts.receiverAmount,
      });

      transactions.push(transRes.account);
      toast.success('Payment successfull!');
      setSelectedAccount(null);
      setReceiverAccount('');
      setAmount(1);
      setDescription('');
      setShowModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  return (
    <div className='bg-black/50 h-screen w-full fixed left-0 top-0 flex justify-center items-center'>
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white rounded-lg shadow-2xl w-1/2'
        onSubmit={handleMakePayment}
      >
        <header className='bg-gray-100 px-4 py-2 flex justify-between items-center'>
          <span className='material-icons-outlined text-gray-500'>
            drag_handle
          </span>
          <button
            type='button'
            onClick={() => {
              setShowModal(false);
            }}
          >
            <span className='material-icons-outlined text-red-500'>close</span>
          </button>
        </header>
        <div className='p-3 flex flex-col'>
          <select
            onChange={(e) => {
              setSelectedAccount(e.target.value);
            }}
            className='mb-6 rounded-lg cursor-pointer'
          >
            <option value={0}>From Account</option>
            {userAccounts.map((account) => (
              <option value={account._id} key={account._id}>
                {account.number} ({account.currency.code})
              </option>
            ))}
          </select>
          <Input
            icon={Wallet}
            type='text'
            placeholder='Receiver Account (_ _ _-_ _ _ _-_ _)'
            value={receiverAccount}
            onChange={(e) => setReceiverAccount(e.target.value)}
          />
          <Input
            icon={Banknote}
            type='number'
            placeholder='Amount'
            min={0.1}
            step='.01'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            icon={Text}
            type='text'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            icon={Code}
            type='password'
            placeholder='Pin code'
            maxLength='4'
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
          />
        </div>

        <footer className='flex justify-end w-100 border-t p-3 mt-5'>
          <button
            type='submit'
            className='bg-violet-600 px-6 py-2 rounded-md border-2 border-white text-white hover:bg-white hover:text-violet-600 hover:border-2 hover:border-violet-600'
            disabled={accountLoading || transactionLoading}
          >
            {accountLoading || transactionLoading ? <Loader /> : 'Make Payment'}
          </button>
        </footer>
      </motion.form>
    </div>
  );
};

export default TransactionModal;
