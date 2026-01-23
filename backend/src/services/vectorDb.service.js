import { ChromaClient } from 'chromadb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
let client;
let useLocalFallback = false;

try {
  client = new ChromaClient({ path: CHROMA_URL });
} catch (e) {
  console.warn('Chroma client init failed, will use local fallback.', e.message || e);
  useLocalFallback = true;
}

const COLLECTION_NAME = 'pdf-rag-collection';
const DATA_DIR = fileURLToPath(new URL('../../data', import.meta.url));
const LOCAL_STORE = path.join(DATA_DIR, 'local_vectors.json');

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LOCAL_STORE)) fs.writeFileSync(LOCAL_STORE, JSON.stringify({ collections: {} }, null, 2));
};

const loadLocalStore = () => {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(LOCAL_STORE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { collections: {} };
  }
};

const saveLocalStore = (store) => {
  ensureDataDir();
  fs.writeFileSync(LOCAL_STORE, JSON.stringify(store, null, 2));
};

const cosineSim = (a, b) => {
  const dot = a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  if (na === 0 || nb === 0) return 0;
  return dot / (na * nb);
};

export const getCollection = async () => {
  if (useLocalFallback) {
    const store = loadLocalStore();
    if (!store.collections[COLLECTION_NAME]) store.collections[COLLECTION_NAME] = [];
    return {
      add: async ({ ids, embeddings, metadatas, documents }) => {
        const coll = loadLocalStore();
        const list = coll.collections[COLLECTION_NAME] || [];
        for (let i = 0; i < ids.length; i++) {
          list.push({ id: ids[i], embedding: embeddings[i], metadata: metadatas[i], document: documents[i] });
        }
        coll.collections[COLLECTION_NAME] = list;
        saveLocalStore(coll);
      },
      query: async ({ queryEmbeddings, nResults = 3, where = {} }) => {
        const coll = loadLocalStore();
        let list = coll.collections[COLLECTION_NAME] || [];
        // Optional filtering by pdfId
        if (where && where.pdfId) {
          list = list.filter(item => item.metadata && item.metadata.pdfId === where.pdfId);
        }
        const q = queryEmbeddings[0];
        const scored = list.map(item => ({ item, score: cosineSim(q, item.embedding) }));
        scored.sort((a, b) => b.score - a.score);
        const ids = scored.slice(0, nResults).map(s => s.item.id);
        const documents = scored.slice(0, nResults).map(s => s.item.document);
        const metadatas = scored.slice(0, nResults).map(s => s.item.metadata);
        return { ids: [ids], documents: [documents], metadatas: [metadatas], distances: [scored.slice(0, nResults).map(s => s.score)] };
      }
    };
  }

  // Try to use Chroma client; if a call fails we'll toggle fallback.
  try {
    return await client.getOrCreateCollection({ name: COLLECTION_NAME });
  } catch (e) {
    console.warn('Chroma failed, switching to local fallback:', e.message || e);
    useLocalFallback = true;
    return getCollection();
  }
};

export const addDocuments = async (documents, pdfId = null) => {
  const collection = await getCollection();
  const metadatas = documents.map(d => ({ source: 'uploaded-pdf', pdfId }));
  const ids = documents.map(d => d.id);
  const embeddings = documents.map(d => d.embedding);
  const texts = documents.map(d => d.text);

  if (useLocalFallback) {
    await collection.add({ ids, embeddings, metadatas, documents: texts });
    return;
  }

  // For Chroma, pass where metadata via metadatas param; any client-specific fields will be handled by the client
  await collection.add({ ids, embeddings, metadatas, documents: texts });
};

export const queryDocuments = async (queryEmbedding, nResults = 3, pdfId = null) => {
  const collection = await getCollection();
  if (useLocalFallback) {
    return await collection.query({ queryEmbeddings: [queryEmbedding], nResults, where: { pdfId } });
  }

  const opts = { queryEmbeddings: [queryEmbedding], nResults };
  if (pdfId) opts.where = { pdfId };

  const results = await collection.query(opts);

  return results;
};

export const clearCollection = async () => {
  if (useLocalFallback) {
    const store = loadLocalStore();
    store.collections[COLLECTION_NAME] = [];
    saveLocalStore(store);
    return;
  }

  try {
    await client.deleteCollection({ name: COLLECTION_NAME });
  } catch (e) {
    // Collection might not exist or deletion failed
  }
};

export const isUsingLocalFallback = () => useLocalFallback;