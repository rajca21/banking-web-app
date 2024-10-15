import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, Lock, Mail, User } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import Input from '../../components/shared/Input';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isStrong, setIsStrong] = useState(false);

  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, firstName, lastName);
      navigate(`/verify-email/${email}`);
    } catch (error) {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-violet-400 to-purple-500 text-transparent bg-clip-text'>
          Create Account
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type='text'
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            icon={User}
            type='text'
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            icon={Mail}
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
          {password && (
            <PasswordStrengthMeter
              password={password}
              setIsStrong={setIsStrong}
            />
          )}

          <motion.button
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white 
                    font-bold rounded-lg shadow-lg hover:from-violet-600
                    hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                     focus:ring-offset-gray-900 transition duration-200'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={!isStrong || isLoading}
          >
            {isLoading ? (
              <Loader className=' animate-spin mx-auto' size={24} />
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>
      </div>
      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Already have an Account?{' '}
          <Link to={'/login'} className='text-violet-400 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUp;
