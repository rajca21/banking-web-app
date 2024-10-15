import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/currencies';
axios.defaults.withCredentials = true;

export const useCurrenciesStore = create((set) => ({
  // State
  error: null,
  isLoading: false,

  // Create Currency
  createCurrency: async (data) => {
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
          'Something went wrong while creating currency',
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Currencies
  getCurrencies: async () => {
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
          'Something went wrong while fetching currencies',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update Currency
  updateCurrency: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/${id}`, data);
      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while updating currency',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete Currency
  deleteCurrency: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response.data.message ||
          'Something went wrong while deleting currency',
        isLoading: false,
      });
      throw error;
    }
  },
}));
