import { setAiClient, generateEmbedding } from '../src/services/embedding.service.js';

// Simple mock AI client to capture the request and return a fake embedding.
const calls = [];
const mockAi = {
  models: {
    embedContent: async (params) => {
      calls.push(params);
      return { embeddings: [{ values: [42, 43, 44] }] };
    }
  }
};

setAiClient(mockAi);

(async () => {
  try {
    const emb = await generateEmbedding('test text');
    if (!Array.isArray(emb) || emb.length !== 3 || emb[0] !== 42) {
      console.error('❌ Unexpected embedding result', emb);
      process.exit(1);
    }

    const req = calls[0];
    if (!req || !Array.isArray(req.contents) || !req.contents[0] || !req.contents[0].parts || req.contents[0].parts[0].text !== 'test text') {
      console.error('❌ Invalid request shape sent to embedContent:', JSON.stringify(req, null, 2));
      process.exit(1);
    }

    console.log('✅ Embed integration test passed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
})();
