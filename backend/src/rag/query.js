import { generateEmbedding } from '../services/embedding.service.js';
import { queryDocuments } from '../services/vectorDb.service.js';
import { generateAnswer } from '../services/llm.service.js';

export const queryPdf = async (question, pdfId = null) => {
  console.log(`❓ Querying: ${question}`);

  // 1. Embed the Question
  const queryEmbedding = await generateEmbedding(question);

  // 2. Retrieve Relevant Chunks
  // Chroma returns { ids: [[]], distances: [[]], metadatas: [[]], documents: [[]] }
  const results = await queryDocuments(queryEmbedding, 3, pdfId);
  
  const relevantDocs = results.documents[0]; // First (and only) query result list

  if (!relevantDocs || relevantDocs.length === 0) {
    return "I couldn't find any relevant information in the uploaded PDF.";
  }

  const context = relevantDocs.join("\n\n---\n\n");
  console.log("📚 Context found:", context.substring(0, 100) + "...");

  // 3. Generate Answer with LLM
  const answer = await generateAnswer(question, context);
  
  return answer;
};