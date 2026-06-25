import API from './api';

export const submitQuestion = async (data) => {
  const response = await API.post('/questions/ask', data);
  return response.data;
};

export const getPublicQuestions = async (params) => {
  const response = await API.get('/questions/public', { params });
  return response.data;
};

export const getPublicQuestionById = async (id) => {
  const response = await API.get(`/questions/public/${id}`);
  return response.data;
};

export const getAdminQuestions = async () => {
  const response = await API.get('/questions');
  return response.data;
};

export const answerQuestion = async (id, data) => {
  const response = await API.put(`/questions/answer/${id}`, data);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await API.delete(`/questions/${id}`);
  return response.data;
};
