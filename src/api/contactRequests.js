import axiosClient from './axiosClient';

export const getContactRequests = async () => {
  const response = await axiosClient.get('/api/contact/');
  return response.data;
};

export const getContactRequestById = async (id) => {
  const response = await axiosClient.get(`/api/contact/${id}`);
  return response.data;
};

export const updateContactRequest = async (id, data) => {
  const response = await axiosClient.put(`/api/contact/${id}`, data);
  return response.data;
};

export const deleteContactRequest = async (id) => {
  const response = await axiosClient.delete(`/api/contact/${id}`);
  return response.data;
};

export const createContactRequest = async (data) => {
  const response = await axiosClient.post('/api/contact/', data);
  return response.data;
};

export const uploadPetImage = async (formData) => {
  const response = await axiosClient.post('/api/contact/upload-pet-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};