import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/accounts';
axios.defaults.withCredentials = true;

export const useAccountsStore = create((set) => ({
  // State
  error: null,
  isLoading: false,

  // Create Account Admin
  createAccount: async (data) => {
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
          'Something went wrong while creating account',
        isLoading: false,
      });
      throw error;
    }
  },

  // Create My Account
  createMyAccount: async (data) => {
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
          'Something went wrong while creating my account',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Accounts
  getAccounts: async (user, currency) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}${user || currency ? '?' : ''}${
          user ? `user=${user}&` : ''
        }${currency ? `currency=${currency}` : ''}`
      );

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching accounts',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get My Accounts
  getMyAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/my`);

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching my accounts',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Account By Number
  getAccountByNumber: async (number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/find?number=${number}`);

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching account',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Account By Id
  getAccountById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`);

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while fetching account',
        isLoading: false,
      });
      throw error;
    }
  },

  // Verify Account
  verifyAccount: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/verify/${id}`);

      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while verifying account',
        isLoading: false,
      });
      throw error;
    }
  },
}));
