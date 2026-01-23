import { addDocuments, queryDocuments, clearCollection } from '../src/services/vectorDb.service.js';

const run = async () => {
  await clearCollection();
  const docs = [
    { id: 'd1', text: 'hello world', embedding: [1, 0, 0, 0, 0, 0, 0, 0] },
    { id: 'd2', text: 'foo bar', embedding: [0, 1, 0, 0, 0, 0, 0, 0] },
  ];

  await addDocuments(docs);
  const res = await queryDocuments([1, 0, 0, 0, 0, 0, 0, 0], 2);
  console.log('Query results:', JSON.stringify(res, null, 2));
};

run().catch(err => { console.error(err); process.exit(1); });
