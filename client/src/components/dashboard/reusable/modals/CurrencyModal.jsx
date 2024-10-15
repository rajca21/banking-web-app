import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Binary, Code, Loader, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

import { useCurrenciesStore } from '../../../../store/currencyStore';
import Input from '../../../shared/Input';

const CurrencyModal = ({
  currency = null,
  setShowModal,
  setSelectedCurrency,
  allCurrencies,
  setAllCurrencies,
}) => {
  const [name, setName] = useState(currency?.name || '');
  const [code, setCode] = useState(currency?.code || '');
  const [accountPrefix, setAccountPrefix] = useState(
    currency?.accountPrefix || ''
  );

  const { createCurrency, deleteCurrency, updateCurrency, isLoading } =
    useCurrenciesStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === '') {
      toast.error('Currency name is required!');
      return;
    }
    if (code.trim() === '') {
      toast.error('Currency code is required!');
      return;
    }
    if (accountPrefix.trim() === '') {
      toast.error('Account prefix is required!');
      return;
    }
    if (isNaN(accountPrefix)) {
      toast.error('Account prefix must be consisted of digits!');
      return;
    }

    if (currency) {
      // Update
      try {
        await updateCurrency(currency._id, {
          name,
          code,
          accountPrefix,
        });
        toast.success('Currency updated');
        allCurrencies.map((curr) => {
          if (curr._id === currency._id) {
            curr.name = name;
            curr.code = code;
            curr.accountPrefix = accountPrefix;
          }
        });
        setSelectedCurrency(null);
        setShowModal(false);
      } catch (error) {
        toast.error('Something went wrong!');
        console.error(error);
      }
    } else {
      // Create New
      try {
        const res = await createCurrency({
          name,
          code,
          accountPrefix,
        });
        toast.success('Currency added');
        allCurrencies.push(res.currency);
        setSelectedCurrency(null);
        setShowModal(false);
      } catch (error) {
        toast.error('Something went wrong!');
        console.error(error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCurrency(currency._id);
      let newCurrencies = allCurrencies.filter((curr) => {
        return curr._id !== currency._id;
      });
      setAllCurrencies(newCurrencies);
      toast.success('Currency deleted');
      setSelectedCurrency(null);
      setShowModal(false);
    } catch (error) {
      toast.error('Something went wrong!');
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
              setSelectedCurrency(null);
            }}
          >
            <span className='bg-red-500'></span>
            <span className='bg-teal-500'></span>
            <span className='material-icons-outlined text-red-500'>close</span>
          </button>
        </header>
        <div className='p-3 flex flex-col'>
          <Input
            icon={Wallet}
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            icon={Code}
            type='text'
            placeholder='Code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Input
            icon={Binary}
            type='text'
            placeholder='Prefix'
            value={accountPrefix}
            onChange={(e) => setAccountPrefix(e.target.value)}
          />
        </div>

        <footer className='flex justify-end w-100 border-t p-3 mt-5'>
          <button
            type='submit'
            className='bg-violet-600 px-6 py-2 rounded-md border-2 border-white text-white hover:bg-white hover:text-violet-600 hover:border-2 hover:border-violet-600'
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className='w-6 h-6 animate-spin  mx-auto' />
            ) : currency ? (
              'Update'
            ) : (
              'Create'
            )}
          </button>
          {currency && (
            <button
              type='button'
              className='bg-red-600 px-6 py-2 rounded-md border-2 border-white text-white hover:bg-white hover:text-red-600 hover:border-2 hover:border-red-600'
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className='w-6 h-6 animate-spin  mx-auto' />
              ) : (
                'Delete'
              )}
            </button>
          )}
        </footer>
      </motion.form>
    </div>
  );
};

export default CurrencyModal;
