import React, { useState, useEffect, useRef } from 'react';
import { askQuestion, getPdfs } from '../services/api';
import { Send, Bot, User, Loader2, Trash, Copy } from 'lucide-react';

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const messagesEndRef = useRef(null);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    // scroll to bottom whenever chat updates or loading state changes
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleAsk = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!question.trim()) return;

    const timestamp = new Date().toISOString();
    const userMsg = { role: 'user', content: question, timestamp };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await askQuestion(userMsg.content, selectedPdf);
      const botMsg = { role: 'bot', content: response.data.answer, timestamp: new Date().toISOString() };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      let errorMsg = "Error: Could not fetch answer.";
      
      if (err.code === "ERR_NETWORK" || !err.response) {
        errorMsg = "Error: Cannot connect to Backend. Is it running?";
      }

      setChatHistory(prev => [...prev, { role: 'bot', content: errorMsg, timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }; 

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const exportChat = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(chatHistory, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Export failed", e);
      alert("Could not copy chat to clipboard.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-[600px] flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Bot size={24} className="text-blue-600" />
          Ask AI
          {selectedPdf && (
            <span className="ml-3 bg-gray-100 text-sm px-2 py-1 rounded">
              {pdfs.find(p => p.pdfId === selectedPdf)?.pdfName || 'PDF selected'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={clearChat} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <Trash size={16} /> Clear
          </button>
          <button type="button" onClick={exportChat} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <Copy size={16} /> {copied ? 'Copied' : 'Export'}
          </button>
        </div>
      </h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4">
        <label className="text-sm text-gray-600 w-full sm:w-auto">Select PDF:</label>
        <select
          className="flex-1 min-w-0 border rounded px-3 py-2 text-sm w-full"
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
            <div className={`max-w-[80%] p-3 rounded-lg flex gap-3 items-start ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
               <span className="mt-1">{msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}</span>
               <div>
                 <p className="whitespace-pre-wrap text-sm leading-relaxed max-w-[60ch]">{msg.content}</p>
                 <div className="text-[11px] text-gray-400 mt-1">{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}</div>
               </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
        <textarea
          rows={1}
          className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Ask a question about the PDF..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center"
          disabled={loading || !question.trim()}
        >
          <Send size={18} />
          <span className="ml-2 hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};

export default ChatBox;