# Ask My PDF 📚

A lightweight RAG (Retrieval-Augmented Generation) app — upload PDFs, index their content as embeddings, and chat with your documents using a generative model.

---

## ✨ Features

- Upload PDFs and extract text automatically
- Generate embeddings and store them in Chroma (or local fallback)
- Ask questions scoped to a specific PDF or across all documents
- Clean, responsive React frontend (Vite) with drag & drop upload and progress
- Local-first design — your documents are not uploaded to third-party services by this app

---

## 🧩 Tech stack

- Backend: Node.js + Express
- LLM: Google Gemini (via `@google/genai`) — needs API key
- Vector DB: Chroma (preferred) with a local JSON fallback
- Frontend: React + Vite
- Storage: local filesystem for uploads & JSON metadata

---

## 🚀 Quick start (local)

Prerequisites:
- Node.js (18+ recommended)
- Docker (recommended for Chroma) or use local fallback
- Gemini API key (if you want real LLM answers)

1. Start Chroma (optional, recommended)

   - Using Docker Compose (in `backend/`):
     ```bash
     cd backend
     docker-compose up -d
     ```
   - Or run the provided PowerShell helper: `scripts/start-chroma.ps1`

2. Backend

   - Create `.env` file in `backend/`:
     ```env
     GEMINI_API_KEY=your_gemini_key_here
     PORT=3000
     CHROMA_URL=http://localhost:8000   # optional if not default
     ```
   - Install and run:
     ```bash
     cd backend
     npm install
     npm run dev     # runs server with file-watcher
     ```
   - API base: http://localhost:3000/api

3. Frontend

   ```bash
   cd frontend
   npm install
   npm run dev   # opens Vite dev server (default http://localhost:5173)
   ```

---

## 🧭 API (useful endpoints)

- **POST** `/api/upload`
  - Multipart form with `pdf` field (file). Returns JSON: `{ message, chunks, pdf }`
- **POST** `/api/chat`
  - Body: `{ question: string, pdfId?: string }` → returns `{ answer }`
- **GET** `/api/pdfs`
  - Returns list of uploaded PDFs + metadata

(See `frontend/src/services/api.js` for client examples using axios.)

Example: Ask a question
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Summarize the conclusion","pdfId":null}'
```

---

## 🛠 Implementation notes

- If Chroma is unavailable, code falls back to a simple local JSON-based vector store (see `backend/data/local_vectors.json`).
- PDFs are parsed, chunked, embedded, and saved with a generated `pdfId` for scoping queries.
- The app adds metadata about uploads in `backend/data/pdfs.json`.

---

## 🧪 Tests

- Backend has a small embedding test: `npm run test:embed` (in `backend/`)

---

## ✅ Contributing

- Open an issue or PR; keep changes small and test locally.
- Please include a short description and screenshots for UI changes.

---

## 📜 License & Notes

- Add a `LICENSE` file as needed. Currently no license specified.
- This project is intended for local/private document analysis — **do not** upload sensitive docs unless you control the environment.

---

If you want, I can add:
- Basic architecture diagram or screenshots
- A short changelog entry for the UI improvements
- A quick demo GIF showing upload -> chat flow

Which would you like me to add next? (I can commit and push this README now.)
