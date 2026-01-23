import express from 'express';
import { getPdfs } from '../controllers/pdf.controller.js';

const router = express.Router();

router.get('/', getPdfs);

export default router;
