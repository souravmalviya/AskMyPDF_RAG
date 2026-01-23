import { queryPdf } from '../rag/query.js';

export const chat = async (req, res) => {
  try {
    const { question, pdfId } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const answer = await queryPdf(question, pdfId);
    
    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate answer" });
  }
};