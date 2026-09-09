import axiosClient from './axiosClient';

export const login = async (email, password) => {
  const response = await axiosClient.post('/api/auth/login', { username, password });
  return response.data;
};

export const verifyToken = async () => {
  const response = await axiosClient.get('/api/auth/verify');
  return response.data;
};
