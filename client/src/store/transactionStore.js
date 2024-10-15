import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/transactions';
axios.defaults.withCredentials = true;

export const useTransactionsStore = create((set) => ({
  // State
  error: null,
  isLoading: false,

  // Create Transaction
  createTransaction: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}`, data);

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while creating transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  // Create My Transaction
  createMyTransaction: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/my`, data);

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while creating transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Transactions
  getTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}`);

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching transactions',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get My Transactions
  getMyTransactions: async (startIndex, limit, account, searchTerm, order) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/my${
          startIndex || limit || account || searchTerm ? '?' : ''
        }${startIndex ? `startIndex=${startIndex}` : ''}${
          limit ? `&limit=${limit}` : ''
        }${order ? `&order=${order}` : ''}${
          account ? `&account=${account}` : ''
        }&searchTerm=${searchTerm}`
      );

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching my transactions',
        isLoading: false,
      });
      throw error;
    }
  },
}));
