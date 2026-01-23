import { loadPdf } from '../services/pdfLoader.js';
import { splitText } from '../services/textSplitter.js';
import { generateEmbedding } from '../services/embedding.service.js';
import { addDocuments, isUsingLocalFallback } from '../services/vectorDb.service.js';
import { addPdf } from '../services/pdf.service.js';
import path from 'path';
import fs from 'fs';

export const ingestPdf = async (filePath) => {
  console.log("🚀 Starting Ingestion...");

  // 1. Extract Text
  const text = await loadPdf(filePath);
  console.log(`📄 Text Extracted: ${text.length} chars`);

  // 2. Record PDF metadata and keep collection (support multiple PDFs)
  const pdfMeta = addPdf({ name: path.basename(filePath) || filePath });
  const pdfId = pdfMeta.pdfId;

  // 3. Chunk Text
  const chunks = splitText(text);
  console.log(`🧩 Created ${chunks.length} chunks`);

  // 4. Generate Embeddings & Prepare for DB
  const documents = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await generateEmbedding(chunk);
    
    documents.push({
      id: `chunk-${i}-${Date.now()}`,
      text: chunk,
      embedding: embedding
    });
    
    // Rate limit help (optional but good for stability)
    if (i % 10 === 0) console.log(`Processing chunk ${i + 1}/${chunks.length}`);
  }

  // 5. Store in Vector DB
  await addDocuments(documents, pdfId);
  if (isUsingLocalFallback()) {
    console.log("💾 Stored in local vector store (fallback)");
  } else {
    console.log("💾 Stored in ChromaDB");
  }

  // Cleanup uploaded file
  fs.unlinkSync(filePath);
  
  return { success: true, chunks: chunks.length, pdf: pdfMeta };
};