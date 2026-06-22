import API from './api';

export const getArticles = async (params) => {
  const response = await API.get('/articles', { params });
  return response.data;
};

export const getArticleBySlug = async (slug) => {
  const response = await API.get(`/articles/slug/${slug}`);
  return response.data;
};

export const createArticle = async (data) => {
  const response = await API.post('/articles', data);
  return response.data;
};

export const updateArticle = async (id, data) => {
  const response = await API.put(`/articles/${id}`, data);
  return response.data;
};

export const deleteArticle = async (id) => {
  const response = await API.delete(`/articles/${id}`);
  return response.data;
};
