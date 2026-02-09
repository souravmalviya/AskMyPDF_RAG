import ai from '../src/config/gemini.config.js';

(async () => {
  try {
    const res = await ai.models.list();
    const embedModels = res.pageInternal?.filter(m => 
      m.supportedActions?.includes('embedContent')
    );
    console.log('Embedding-capable models:', JSON.stringify(embedModels, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('List models failed:', err);
    process.exit(1);
  }
})();