import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Code, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuthStore } from '../../../../store/authStore';
import { useAccountsStore } from '../../../../store/accountStore';
import { useCurrenciesStore } from '../../../../store/currencyStore';
import Input from '../../../shared/Input';

const AccountModal = ({ setShowModal, accounts }) => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [pinCode, setPinCode] = useState('');

  const { user } = useAuthStore();
  const { createMyAccount, isLoading } = useAccountsStore();
  const { getCurrencies, isLoading: loadingCurrencies } = useCurrenciesStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCurrency || selectedCurrency === '0') {
      toast.error('Please select a currency');
      return;
    }
    if (pinCode.trim() === '') {
      toast.error('Please provide your accounts pin code!');
      return;
    }
    if (user.userPin !== pinCode) {
      toast.error('Wrong pin code!');
      return;
    }

    try {
      const res = await createMyAccount({
        currency: selectedCurrency,
      });
      accounts.push(res.account);
      setShowModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    } finally {
      setShowModal(false);
    }
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await getCurrencies();
        setCurrencies(res.currencies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrencies();
  }, []);

  return (
    <div className='bg-black/50 h-screen w-full fixed left-0 top-0 flex justify-center items-center'>
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white rounded-lg shadow-2xl w-1/2'
        onSubmit={handleSubmit}
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
          {loadingCurrencies ? (
            <></>
          ) : (
            <select
              onChange={(e) => {
                setSelectedCurrency(e.target.value);
              }}
              className='rounded-lg cursor-pointer'
            >
              <option value={0}>Pick Currency</option>
              {currencies.map((currency) => (
                <option value={currency._id} key={currency._id}>
                  {currency.code}
                </option>
              ))}
            </select>
          )}

          <div className='mt-6'>
            <Input
              icon={Code}
              type='password'
              placeholder='Pin code'
              maxLength='4'
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>
        </div>

        <footer className='flex justify-end w-100 border-t p-3'>
          <button
            type='submit'
            className='bg-violet-600 px-6 py-2 rounded-md border-2 border-white text-white hover:bg-white hover:text-violet-600 hover:border-2 hover:border-violet-600'
            disabled={isLoading || loadingCurrencies}
          >
            {isLoading || loadingCurrencies ? (
              <Loader className='w-6 h-6 animate-spin  mx-auto' />
            ) : (
              'Send Request'
            )}
          </button>
        </footer>
      </motion.form>
    </div>
  );
};

export default AccountModal;
