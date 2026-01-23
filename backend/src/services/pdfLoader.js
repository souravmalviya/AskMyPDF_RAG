import fs from 'fs';
import pdf from 'pdf-parse';

export const loadPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text; // Returns the full text content of the PDF
  } catch (error) {
    console.error("Error reading PDF:", error);
    throw new Error("Failed to parse PDF");
  }
};