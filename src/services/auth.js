import API from './api';
import { AUTH_LOGIN, AUTH_ME, AUTH_REGISTER } from '@/constants/urls';
import toast from 'react-hot-toast';

export const registerUser = async (formData) => {
  try {
    const payload = {
      name: formData.name,
      identifier: formData.identifier,
      contactPhone: formData.contactPhone || "",
      password: formData.password
    };
    const response = await API.post(AUTH_REGISTER, payload);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const loginUser = async (formData) => {
  try {
    const payload = {
      identifier: formData.identifier || formData.username,
      password: formData.password
    };
    const response = await API.post(AUTH_LOGIN, payload);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
};

export const checkAuthStatus = async () => {
  try {
    const response = await API.get(AUTH_ME);
    return response.data;
  } catch (error) {
    console.error("Auth Status Error:", error);
    // Silent for checkAuthStatus to prevent guest user toast alerts
    throw error;
  }
};
