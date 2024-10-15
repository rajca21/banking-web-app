import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users';
axios.defaults.withCredentials = true;

export const useUsersStore = create((set) => ({
  // State
  error: null,
  isLoading: false,

  // Get Users
  getUsers: async () => {
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
          'Something went wrong while fetching users',
        isLoading: false,
      });
      throw error;
    }
  },
}));
