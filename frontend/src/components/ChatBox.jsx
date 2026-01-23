import React, { useState, useEffect } from 'react';
import { askQuestion, getPdfs } from '../services/api';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPdfs();
        setPdfs(res.data.pdfs || []);
      } catch (e) {
        console.warn('Could not load PDFs', e);
      }
    };
    load();
  }, []);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await askQuestion(userMsg.content, selectedPdf);
      const botMsg = { role: 'bot', content: response.data.answer };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      let errorMsg = "Error: Could not fetch answer.";
      
      if (err.code === "ERR_NETWORK" || !err.response) {
        errorMsg = "Error: Cannot connect to Backend. Is it running?";
      }

      setChatHistory(prev => [...prev, { role: 'bot', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-[600px] flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Bot size={24} className="text-blue-600" />
        Ask AI
      </h2>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-600">Scope:</label>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={selectedPdf || ''}
          onChange={(e) => setSelectedPdf(e.target.value || null)}
        >
          <option value="">All PDFs</option>
          {pdfs.map(p => (
            <option key={p.pdfId} value={p.pdfId}>
              {p.pdfName} — {p.uploadedAt ? new Date(p.uploadedAt).toLocaleString() : 'unknown'}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p>No messages yet.</p>
            <p className="text-sm">Upload a PDF and ask a question!</p>
          </div>
        )}
        
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg flex gap-3 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
               <span className="mt-1">{msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}</span>
               <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none flex items-center gap-2">
                <Loader2 className="animate-spin text-gray-500" size={18} />
                <span className="text-gray-500 text-sm">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleAsk} className="flex gap-2 border-t pt-4">
        <input 
          type="text" 
          className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask a question about the PDF..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center"
          disabled={loading || !question.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;