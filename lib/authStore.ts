import { create } from "zustand";
import axios from "axios";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  isVerified: boolean;
  verificationToken: string;
  verificationTokenExpiresAt: string;
  lastlogin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Auth = {
  user: User | null;
  isAuthenticated: boolean;
  error: boolean | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotpassword: (email: string) => Promise<void>;
  resetpassword: (token: string, password: string) => Promise<void>;
};

const API_URL = "https://e-commerce-server-rnas.onrender.com";

axios.defaults.withCredentials = true;
export const useAuthStore = create<Auth>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  //logic for signing up
  signup: async (email: string, password: string, name: string) => {
    //setter function, set its initial state first
    set({ isLoading: true, error: null });
    try {
      let response = await axios.post(`${API_URL}/signUp`, {
        name,
        email,
        password,
        role: "admin",
      });
      set({
        //update the state
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      let response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });
      set({
        //update the states
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response.data.message || "Error verifying the email",
        isLoading: false,
      });
    }
  },
  //function to protect our routes, check if authenticated first.
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      let response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error: any) {
      set({
        error: error.response.data.message || null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      throw Error;
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      let response = await axios.post(`${API_URL}/logIn`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        isLoading: false,
        user: response.data.user,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response.data.message || "Error logging in.",
        isLoading: false,
      });
      throw Error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      let response = await axios.post(`${API_URL}/logOut`);
      set({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response.data.message || "error occured while logging out",
        isLoading: false,
      });
      throw Error;
    }
  },
  //ui that will prompt the user its email
  forgotpassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      let response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ isLoading: false, message: response.data.message });
    } catch (error: any) {
      set({
        error:
          error.reseponse.data.message ||
          "Error sending the email verifacation",
        isLoading: false,
      });
    }
  },
  //reset ui
  resetpassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      let response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response.data.message || "error reseting the password",
      });
      throw Error;
    }
  },
}));
