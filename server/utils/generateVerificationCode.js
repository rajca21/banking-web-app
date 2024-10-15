export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateAccountNumber = (currencyCode) => {
  const firstDigits = Math.floor(1000 + Math.random() * 9000).toString();
  const secondDigits = Math.floor(10 + Math.random() * 90).toString();
  return currencyCode + '-' + firstDigits + '-' + secondDigits;
};
