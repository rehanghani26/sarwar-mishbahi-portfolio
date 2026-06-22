import API from './api';

export const submitContact = async (data) => {
  const response = await API.post('/contacts', data);
  return response.data;
};

export const getContacts = async () => {
  const response = await API.get('/contacts');
  return response.data;
};

export const markContactReadStatus = async (id) => {
  const response = await API.put(`/contacts/${id}`);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await API.delete(`/contacts/${id}`);
  return response.data;
};
