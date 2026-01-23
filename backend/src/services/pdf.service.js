import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_DIR = fileURLToPath(new URL('../../data', import.meta.url));
const PDF_STORE = path.join(DATA_DIR, 'pdfs.json');

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PDF_STORE)) fs.writeFileSync(PDF_STORE, JSON.stringify([] , null, 2));
};

const loadStore = () => {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(PDF_STORE, 'utf8')) || [];
  } catch (e) {
    return [];
  }
};

const saveStore = (list) => {
  ensureDataDir();
  fs.writeFileSync(PDF_STORE, JSON.stringify(list, null, 2));
};

export const addPdf = ({ name }) => {
  const list = loadStore();
  const id = `pdf-${Date.now()}`;
  const safeName = path.basename(String(name || ''));
  const entry = { pdfId: id, pdfName: safeName || name, uploadedAt: new Date().toISOString() };
  list.push(entry);
  saveStore(list);
  return entry;
};

export const listPdfs = () => {
  return loadStore();
};

export const findPdf = (pdfId) => {
  const list = loadStore();
  return list.find(p => p.pdfId === pdfId);
};

export default { addPdf, listPdfs, findPdf };
