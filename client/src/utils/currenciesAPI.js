import axios from 'axios';

export const getAllCurrencies = async () => {
  try {
    const res = await axios.get(`https://api.frankfurter.app/currencies`, {
      withCredentials: false,
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const convert = async (amount, from, to) => {
  try {
    const res = await axios.get(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
      {
        withCredentials: false,
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
