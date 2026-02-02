import React, { useState, useEffect } from 'react';
import { uploadPdf, getPdfs } from '../services/api';
import { Upload, CheckCircle, AlertCircle, Loader2, FileText, X } from 'lucide-react';

const MAX_FILE_MB = 20; // client-side limit

const UploadPdf = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const res = await getPdfs();
        setRecent(res.data.pdfs || []);
      } catch (e) {
        // ignore - optional benefit
      }
    };
    loadRecent();
  }, []);

  // Auto-dismiss successful messages after a short delay
  useEffect(() => {
    if (message && !error) {
      const t = setTimeout(() => clearMessage(), 4500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [message, error]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError(true);
      setMessage('Please upload a valid PDF file.');
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(true);
      setMessage(`File too large. Max ${MAX_FILE_MB}MB allowed.`);
      return;
    }

    setLoading(true);
    setError(false);
    setMessage(null);
    setCurrentFile({ name: file.name, size: file.size });
    setProgress(0);

    try {
      await uploadPdf(file, (p) => setProgress(p));
      setMessage('PDF Uploaded & Processed Successfully!');
      setError(false);
      setCurrentFile(null);
      if (onUploadSuccess) onUploadSuccess();

      // refresh recent list
      try {
        const res = await getPdfs();
        setRecent(res.data.pdfs || []);
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Upload error:', err);

      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError(true);
        setMessage('Cannot connect to Backend (is Node.js running on port 3000?)');
      } else {
        setError(true);
        setMessage(err.response?.data?.error || 'Failed to upload PDF.');
      }
    } finally {
      setLoading(false);
      setProgress(0);
      setIsDragging(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    await handleFileUpload(file);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    await handleFileUpload(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const clearMessage = () => {
    setMessage(null);
    setError(false);
  };

  const formatSize = (size) => {
    if (!size) return '';
    return size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Upload size={24} className="text-blue-600" />
          <span>Upload Document</span>
        </div>
      </h2>

      <div
        className={`flex flex-col items-center justify-center border-2 rounded-lg p-6 bg-gray-50 transition cursor-pointer relative ${isDragging ? 'border-blue-300 bg-blue-50' : 'border-dashed border-gray-300 hover:bg-gray-100'}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center text-blue-600">
            <Loader2 className="animate-spin mb-2" size={28} />
            <p className="text-sm">Uploading & processing... {progress ? `${progress}%` : ''}</p>
            <div className="w-full bg-gray-200 rounded h-2 mt-3 overflow-hidden">
              <div className="h-2 bg-blue-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="font-medium">Click to upload PDF</p>
            <p className="text-sm">or drag and drop here</p>
            {currentFile && (
              <div className="mt-3 text-left text-sm text-gray-600">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <div className="truncate max-w-[18rem]">{currentFile.name}</div>
                    <div className="text-xs text-gray-400">{formatSize(currentFile.size)}</div>
                  </div>
                  <button type="button" onClick={() => setCurrentFile(null)} className="text-gray-400 hover:text-gray-700"><X size={14} /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-md flex items-start gap-3 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm leading-snug break-words whitespace-normal">{message}</p>
              <button onClick={clearMessage} className="text-xs text-gray-500 ml-3">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent uploads</h3>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {recent.map((p) => (
              <li key={p.pdfId} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-500" />
                  <div className="text-sm">
                    <div className="truncate max-w-[20rem]">{p.pdfName}</div>
                    <div className="text-xs text-gray-400">{p.uploadedAt ? new Date(p.uploadedAt).toLocaleString() : 'unknown'}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPdf;