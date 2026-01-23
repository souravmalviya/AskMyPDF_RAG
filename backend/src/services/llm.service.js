import ai from '../config/gemini.config.js';

export const generateAnswer = async (question, context) => {
  const systemPrompt = `
    You are a helpful assistant. Use the following pieces of context to answer the question at the end.
    If the answer is not in the context, say "I don't know based on the provided document."
    Keep the answer concise.
    
    Context:
    ${context}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
          parts: [
              { text: systemPrompt },
              { text: `Question: ${question}` }
          ]
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating answer:", error);
    throw new Error("LLM generation failed");
  }
};