import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuthStore } from '../../store/authStore';

const PinForm = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const { updateUser, error, isLoading } = useAuthStore();
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 4).split('');
      for (let i = 0; i < 4; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '');
      const focusIndex = lastFilledIndex < 3 ? lastFilledIndex + 1 : 3;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pinCode = code.join('');

    try {
      await updateUser({
        pin: pinCode,
      });
      navigate('/dashboard');
      toast.success('Pin code saved');
    } catch (error) {
      console.error(error);
    }
  };

  // Autosubmit
  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      handleSubmit(new Event('submit'));
    }
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
      >
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-violet-400 to-purple-500 text-transparent bg-clip-text'>
          PIN CODE
        </h2>

        <>
          <p className='text-center text-gray-300 mb-6'>
            Enter the 4-digit Pin code that will be used inside of application
            for veryfing your account.
          </p>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex justify-center gap-5'>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type='text'
                  maxLength='4'
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-violet-500 focus:outline-none'
                />
              ))}
            </div>

            {error && (
              <p className='text-red-500 font-semibold mt-2'>{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type='submit'
              disabled={isLoading || code.some((digit) => !digit)}
              className='w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-violet-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 disabled:opacity-50'
            >
              {isLoading ? 'Saving...' : 'Save Pin'}
            </motion.button>
          </form>
        </>
      </motion.div>
    </div>
  );
};

export default PinForm;
