import { ingestPdf } from '../rag/ingest.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await ingestPdf(req.file.path);

    res.json({ 
      message: "PDF processed successfully", 
      chunks: result.chunks,
      pdf: result.pdf
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
};