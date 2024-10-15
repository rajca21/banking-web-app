import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { useCurrenciesStore } from '../../../store/currencyStore';
import LoadingSpinner from '../../shared/LoadingSpinner';
import CurrencyCard from '../reusable/CurrencyCard';
import CurrencyModal from '../reusable/modals/CurrencyModal';

const CurrenciesView = () => {
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const { getCurrencies, isLoading, error } = useCurrenciesStore();

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await getCurrencies();
        setAllCurrencies(res.currencies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrencies();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='my-10 w-full flex items-center justify-center text-red-500 font-semibold text-2xl'>
        {error}
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col justify-between p-5 items-center'
      >
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
          Add new Currency
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className='flex flex-col w-full items-center justify-center'
        >
          {allCurrencies.map((currency) => (
            <CurrencyCard
              onClick={() => {
                setSelectedCurrency(currency);
                setShowModal(true);
              }}
              key={currency._id}
              currency={currency}
            />
          ))}
        </motion.div>
      </motion.div>

      {showModal && (
        <CurrencyModal
          setShowModal={setShowModal}
          setSelectedCurrency={setSelectedCurrency}
          currency={selectedCurrency}
          allCurrencies={allCurrencies}
          setAllCurrencies={setAllCurrencies}
        />
      )}
    </>
  );
};

export default CurrenciesView;
