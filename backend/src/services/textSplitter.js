export const splitText = (text, chunkSize = 1000, overlap = 200) => {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);
    chunks.push(chunk);
    
    // Move forward by chunkSize - overlap
    startIndex += (chunkSize - overlap);
  }

  return chunks;
};