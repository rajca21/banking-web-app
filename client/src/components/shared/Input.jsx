const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className='relative mb-6'>
      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
        <Icon className='size-5' color='#8b5cf6' />
      </div>
      <input
        {...props}
        className='w-full pl-10 pr-3 py-2 bg-slate-50 rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 text-gray-800 placeholder-gray-400 transition duration-200'
      />
    </div>
  );
};
export default Input;
