import React, { useState } from 'react';
import { uploadPdf } from '../services/api';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const UploadPdf = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError(true);
      setMessage("Please upload a valid PDF file.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      await uploadPdf(file);
      setMessage("PDF Uploaded & Processed Successfully!");
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Upload error:", err);
      
      // Check if it's a network error (server not running)
      if (err.code === "ERR_NETWORK" || !err.response) {
         setError(true);
         setMessage("Cannot connect to Backend (is Node.js running on port 3000?)");
      } else {
         setError(true);
         setMessage(err.response?.data?.error || "Failed to upload PDF.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Upload size={24} className="text-blue-600" />
        Upload Document
      </h2>
      
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />
        
        {loading ? (
          <div className="flex flex-col items-center text-blue-600">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Processing PDF... This may take a moment.</p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="font-medium">Click to upload PDF</p>
            <p className="text-sm">or drag and drop here</p>
          </div>
        )}
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-md flex items-center gap-2 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default UploadPdf;