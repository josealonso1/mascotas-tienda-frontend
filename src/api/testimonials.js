import axiosClient from './axiosClient';

export const getTestimonials = async () => {
  const response = await axiosClient.get('/api/testimonials/');
  return response.data;
};

export const getTestimonialById = async (id) => {
  const response = await axiosClient.get(`/api/testimonials/${id}`);
  return response.data;
};

export const createTestimonial = async (data) => {
  const response = await axiosClient.post('/api/testimonials/', data);
  return response.data;
};

export const submitTestimonial = async (data) => {
  const response = await axiosClient.post('/api/testimonials/submit', data);
  return response.data;
};

export const updateTestimonial = async (id, data) => {
  const response = await axiosClient.put(`/api/testimonials/${id}`, data);
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await axiosClient.delete(`/api/testimonials/${id}`);
  return response.data;
};
