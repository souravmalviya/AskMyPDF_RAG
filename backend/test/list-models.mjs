import ai from '../src/config/gemini.config.js';

(async () => {
  try {
    const res = await ai.models.list();
    console.log('Models list:', JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('List models failed:', err);
    process.exit(1);
  }
})();