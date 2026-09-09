import axiosClient from './axiosClient';

export const getArtworks = async () => {
  const response = await axiosClient.get('/api/artworks/');
  return response.data;
};

export const getArtworkById = async (id) => {
  const response = await axiosClient.get(`/api/artworks/${id}`);
  return response.data;
};

export const createArtwork = async (data) => {
  const response = await axiosClient.post('/api/artworks/', data);
  return response.data;
};

export const updateArtwork = async (id, data) => {
  const response = await axiosClient.put(`/api/artworks/${id}`, data);
  return response.data;
};

export const deleteArtwork = async (id) => {
  const response = await axiosClient.delete(`/api/artworks/${id}`);
  return response.data;
};

export const uploadArtworkImage = async (formData) => {
  const response = await axiosClient.post('/api/artworks/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
