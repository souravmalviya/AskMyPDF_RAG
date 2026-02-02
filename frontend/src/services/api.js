import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const uploadPdf = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('pdf', file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.lengthComputable) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });
};

export const askQuestion = async (question, pdfId = null) => {
  return axios.post(`${API_URL}/chat`, { question, pdfId });
};

export const getPdfs = async () => {
  return axios.get(`${API_URL}/pdfs`);
};