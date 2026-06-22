import API from './api';

export const loginUser = async (formData) => {
  const response = await API.post('/auth/login', formData);
  return response.data;
};

export const logoutUser = async () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
};

export const checkAuthStatus = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};
