import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const askQuestion = async (question, pdfId = null) => {
  return axios.post(`${API_URL}/chat`, { question, pdfId });
};

export const getPdfs = async () => {
  return axios.get(`${API_URL}/pdfs`);
};