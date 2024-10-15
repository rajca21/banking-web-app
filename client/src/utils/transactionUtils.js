export const calculateAmounts = (senderAccount, receiverAccount, amount) => {
  if (
    !senderAccount ||
    !receiverAccount ||
    !senderAccount.currency ||
    !receiverAccount.currency
  ) {
    throw new Error('Something went wrong with amounts');
  }

  if (senderAccount.currency._id === receiverAccount.currency._id) {
    return {
      senderAmount: -amount,
      receiverAmount: amount,
    };
  }

  const eurAmount = amount * senderAccount.currency.toEur;
  const receiverAmount = eurAmount * receiverAccount.currency.fromEur;

  return {
    senderAmount: -amount,
    receiverAmount,
  };
};
