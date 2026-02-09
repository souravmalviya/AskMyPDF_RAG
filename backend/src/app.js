import express from 'express';
import cors from 'cors';

import chatRoutes from './routes/chat.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import pdfRoutes from './routes/pdf.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pdfs', pdfRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'RAG backend running' });
});

export default app;
