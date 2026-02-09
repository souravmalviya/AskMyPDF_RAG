import ai from '../config/gemini.config.js';

// Allow injection of a custom AI client for testing/mocking.
let aiClient = ai;
export const setAiClient = (client) => {
  aiClient = client;
};

// Local mock fallback for development without a real API key.
const createMockEmbedding = (text, dim = 8) => {
  // deterministic simple hash -> vector for repeatable tests
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  const vec = new Array(dim).fill(0).map((_, i) => ((hash >> (i % 24)) & 0xff) / 255);
  return vec;
};

export const generateEmbedding = async (text) => {
  // If no API key is present or mock is forced, return a local embedding.
  if (!process.env.GEMINI_API_KEY || process.env.FORCE_MOCK_EMBED === '1') {
    return createMockEmbedding(text);
  }

  try {
    const response = await aiClient.models.embedContent({
      model: 'models/gemini-embedding-001',
      // SDK expects a `contents` array where each item has `parts` with `text`.
      contents: [
        { parts: [{ text }] }
      ]
    });

    // The SDK returns `embeddings` array with `.values` on each item.
    if (response && response.embeddings && response.embeddings.length > 0) {
      return response.embeddings[0].values;
    }
    throw new Error('No embeddings returned from API');
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Embedding generation failed");
  }
};