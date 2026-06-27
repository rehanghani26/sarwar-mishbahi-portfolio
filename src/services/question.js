import API from './api';
import { QUESTIONS } from '@/constants/urls';

export const submitQuestion = async (data) => {
  try {
    const response = await API.post(`${QUESTIONS}/ask`, data);
    return response.data;
  } catch (error) {
    console.error("Submit Question Error:", error);
    throw error;
  }
};

export const getPublicQuestions = async (params) => {
  try {
    let url = `${QUESTIONS}/public`;
    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) {
        url += `?${query}`;
      }
    }
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Get Public Questions Error:", error);
    throw error;
  }
};

export const getPublicQuestionById = async (id) => {
  try {
    const response = await API.get(`${QUESTIONS}/public/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Public Question By ID Error:", error);
    throw error;
  }
};

export const getAdminQuestions = async () => {
  try {
    const response = await API.get(QUESTIONS);
    return response.data;
  } catch (error) {
    console.error("Get Admin Questions Error:", error);
    throw error;
  }
};

export const answerQuestion = async (id, data) => {
  try {
    const response = await API.put(`${QUESTIONS}/answer/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Answer Question Error:", error);
    throw error;
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await API.delete(`${QUESTIONS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Question Error:", error);
    throw error;
  }
};
