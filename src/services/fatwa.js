import API from './api';

export const getFatwas = async (params) => {
  const response = await API.get('/fatwas', { params });
  return response.data;
};

export const getFatwaById = async (id) => {
  const response = await API.get(`/fatwas/${id}`);
  return response.data;
};

export const createFatwa = async (data) => {
  const response = await API.post('/fatwas', data);
  return response.data;
};

export const updateFatwa = async (id, data) => {
  const response = await API.put(`/fatwas/${id}`, data);
  return response.data;
};

export const deleteFatwa = async (id) => {
  const response = await API.delete(`/fatwas/${id}`);
  return response.data;
};
