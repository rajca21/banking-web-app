import React from 'react';

import FloatingCircle from '../shared/FloatingCirlce';

const LandingLayout = ({ children }) => {
  return (
    <div
      className='min-h-screen bg-gradient-to-br
    from-gray-900 via-violet-900 to-purple-900 flex items-center justify-center relative overflow-hidden'
    >
      <FloatingCircle
        color='bg-violet-500'
        size='w-64 h-64'
        top='-5%'
        left='10%'
        delay={0}
      />
      <FloatingCircle
        color='bg-purple-500'
        size='w-48 h-48'
        top='70%'
        left='80%'
        delay={5}
      />
      <FloatingCircle
        color='bg-fuchsia-500'
        size='w-32 h-32'
        top='40%'
        left='-10%'
        delay={2}
      />
      {children}
    </div>
  );
};

export default LandingLayout;
