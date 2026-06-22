import API from './api';

export const getEvents = async (params) => {
  const response = await API.get('/events', { params });
  return response.data;
};

export const createEvent = async (data) => {
  const response = await API.post('/events', data);
  return response.data;
};

export const updateEvent = async (id, data) => {
  const response = await API.put(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await API.delete(`/events/${id}`);
  return response.data;
};
