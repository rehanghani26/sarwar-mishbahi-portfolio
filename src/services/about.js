import API from './api';

export const getSettings = async () => {
  const response = await API.get('/settings');
  return response.data;
};

export const putSettings = async (settingsData) => {
  const response = await API.put('/settings', settingsData);
  return response.data;
};

export const getStats = async () => {
  const response = await API.get('/settings/stats');
  return response.data;
};
