import { generateAnswer } from '../src/services/llm.service.js';

(async () => {
  try {
    const answer = await generateAnswer("What's 2+2?", "");
    console.log('LLM response:', answer);
    process.exit(0);
  } catch (err) {
    console.error('LLM test failed:', err);
    process.exit(1);
  }
})();