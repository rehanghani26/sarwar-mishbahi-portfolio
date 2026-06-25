import API from './api';

// --- Publications (Books) ---
export const getPublications = async (params) => {
  const response = await API.get('/publications', { params });
  return response.data;
};

export const createPublication = async (data) => {
  const response = await API.post('/publications', data);
  return response.data;
};

export const updatePublication = async (id, data) => {
  const response = await API.put(`/publications/${id}`, data);
  return response.data;
};

export const deletePublication = async (id) => {
  const response = await API.delete(`/publications/${id}`);
  return response.data;
};

// --- Lectures ---
export const getLectures = async (params) => {
  const response = await API.get('/lectures', { params });
  return response.data;
};

export const createLecture = async (data) => {
  const response = await API.post('/lectures', data);
  return response.data;
};

export const updateLecture = async (id, data) => {
  const response = await API.put(`/lectures/${id}`, data);
  return response.data;
};

export const deleteLecture = async (id) => {
  const response = await API.delete(`/lectures/${id}`);
  return response.data;
};
