import React, { useState } from 'react';
import UploadPdf from './components/UploadPdf';
import ChatBox from './components/ChatBox';

function DecorativeBlob({ className, svgProps }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <g transform="translate(300,300)">
        <path
          d="M120,-160C155,-122,179,-77,186,-26C192,25,182,78,150,114C118,150,65,169,11,177C-43,185,-87,181,-122,151C-157,121,-183,65,-181,8C-179,-49,-148,-98,-111,-136C-74,-174,-37,-202,8,-211C53,-220,106,-209,120,-160Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

function App() {
  const [uploadKey, setUploadKey] = useState(0);

  // Simple trigger to refresh chat or state if needed after upload
  const handleUploadSuccess = () => {
    setUploadKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 antialiased">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 -right-32 w-96 h-96 text-indigo-200 opacity-40 blur-3xl">
          <DecorativeBlob className="w-full h-full text-indigo-300" />
        </div>
        <div className="absolute -bottom-24 -left-28 w-[28rem] h-[28rem] text-emerald-200 opacity-30 blur-2xl">
          <DecorativeBlob className="w-full h-full text-emerald-300" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-10">
  <div className="w-full bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-md fade-in-up px-6 py-8">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4">
      {/* left spacer aligns with upload column */}
      <div className="hidden md:block" />

      {/* Center content */}
      <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline gap-4">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-slate-800 tracking-tight">Ask <span className="text-slate-700">My</span></h1>
          <span className="ml-2 px-4 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-medium shadow-sm text-lg">PDF</span>
        </div>
        <p className="mt-3 text-sm text-slate-500 max-w-2xl">Professional, private, and accurate PDF Q&A.</p>
      </div>

      {/* Right side: placeholder aligns with chat column */}
      <div className="flex items-center justify-end">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium shadow-sm hidden sm:inline-flex">📚Your AI Assistant</span>
      </div>
    </div>

    
  </div>
</header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <aside className="md:col-span-1">
            <div className="backdrop-blur-sm bg-white/60 border border-white/30 rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload</h2>
              <UploadPdf onUploadSuccess={handleUploadSuccess} />
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-100 text-sm text-slate-700">
                <h3 className="font-bold mb-2">How it works</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Upload a PDF document.</li>
                  <li>Wait for processing (embedding) to finish.</li>
                  <li>Ask any question related to the content.</li>
                  <li>Get accurate, context-aware answers.</li>
                </ol>
              </div>
            </div>
          </aside>

          <main className="md:col-span-2">
            <div className="min-h-[60vh] p-6 bg-white rounded-xl shadow-md border border-slate-100">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Chat with your PDF</h3>
                <div className="text-sm text-slate-500">Model: <span className="font-medium text-slate-700">RAG</span></div>
              </div>

              <div className="rounded-md overflow-hidden border border-slate-100">
                <ChatBox key={uploadKey} />
              </div>
            </div>
          </main>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Made with ❤️ by Sourav Malviya · Keep your documents private — no third-party uploads
        </footer>
      </div>
    </div>
  );
}

export default App;