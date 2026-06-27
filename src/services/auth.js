import API from './api';
import { AUTH_LOGIN, AUTH_ME } from '@/constants/urls';

export const loginUser = async (formData) => {
  try {
    const response = await API.post(AUTH_LOGIN, formData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
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
    throw error;
  }
};
