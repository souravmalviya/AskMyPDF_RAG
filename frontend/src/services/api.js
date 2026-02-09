import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const ENDPOINTS = {
  UPLOAD: '/upload',
  CHAT: '/chat',
  PDFS: '/pdfs',
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Upload a PDF file to the server.
 * @param {File} file - The PDF file to upload
 * @param {((percent: number) => void)} [onUploadProgress] - Optional callback for upload progress (0–100)
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const uploadPdf = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('pdf', file);

  return api.post(ENDPOINTS.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.lengthComputable) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    },
  });
};

/**
 * Send a question to the chat API, optionally scoped to a PDF.
 * @param {string} question - The user's question
 * @param {string|null} [pdfId=null] - Optional PDF ID to scope the question to
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const askQuestion = async (question, pdfId = null) => {
  return api.post(ENDPOINTS.CHAT, { question, pdfId });
};

/**
 * Fetch the list of uploaded PDFs.
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const getPdfs = async () => {
  return api.get(ENDPOINTS.PDFS);
};
