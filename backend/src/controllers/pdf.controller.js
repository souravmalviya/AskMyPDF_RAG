import { listPdfs } from '../services/pdf.service.js';

export const getPdfs = (req, res) => {
  try {
    const list = listPdfs();
    res.json({ pdfs: list });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to list PDFs' });
  }
};

export default { getPdfs };
