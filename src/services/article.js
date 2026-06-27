import API from './api';
import { ARTICLES } from '@/constants/urls';

export const getArticles = async (params) => {
  try {
    let url = ARTICLES;
    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) {
        url += `?${query}`;
      }
    }
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Get Articles Error:", error);
    throw error;
  }
};

export const getArticleBySlug = async (slug) => {
  try {
    const response = await API.get(`${ARTICLES}/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get Article By Slug Error:", error);
    throw error;
  }
};

export const createArticle = async (data) => {
  try {
    const response = await API.post(ARTICLES, data);
    return response.data;
  } catch (error) {
    console.error("Create Article Error:", error);
    throw error;
  }
};

export const updateArticle = async (id, data) => {
  try {
    const response = await API.put(`${ARTICLES}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Article Error:", error);
    throw error;
  }
};

export const deleteArticle = async (id) => {
  try {
    const response = await API.delete(`${ARTICLES}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Article Error:", error);
    throw error;
  }
};
