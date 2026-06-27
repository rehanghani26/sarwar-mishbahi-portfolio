import API from './api';
import { CONTACTS } from '@/constants/urls';

export const submitContact = async (data) => {
  try {
    const response = await API.post(CONTACTS, data);
    return response.data;
  } catch (error) {
    console.error("Submit Contact Error:", error);
    throw error;
  }
};

export const getContacts = async () => {
  try {
    const response = await API.get(CONTACTS);
    return response.data;
  } catch (error) {
    console.error("Get Contacts Error:", error);
    throw error;
  }
};

export const markContactReadStatus = async (id) => {
  try {
    const response = await API.put(`${CONTACTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Mark Contact Read Status Error:", error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await API.delete(`${CONTACTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Contact Error:", error);
    throw error;
  }
};
