import React, { useState } from 'react';
import UploadPdf from './components/UploadPdf';
import ChatBox from './components/ChatBox';

function App() {
  const [uploadKey, setUploadKey] = useState(0);

  // Simple trigger to refresh chat or state if needed after upload
  const handleUploadSuccess = () => {
    setUploadKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Ask My PDF 📚</h1>
          <p className="text-slate-500">Upload a document and chat with it using AI.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <UploadPdf onUploadSuccess={handleUploadSuccess} />
             
             <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
               <h3 className="font-bold mb-2">How it works</h3>
               <ol className="list-decimal list-inside space-y-2">
                 <li>Upload a PDF document.</li>
                 <li>Wait for the processing (embedding) to finish.</li>
                 <li>Ask any question related to the content.</li>
                 <li>Get accurate, context-aware answers.</li>
               </ol>
             </div>
          </div>

          <div className="md:col-span-2">
             <ChatBox key={uploadKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;