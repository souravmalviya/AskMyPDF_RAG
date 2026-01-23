
import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile } from '../controllers/upload.controller.js';

const router = express.Router();

const fs = await import('fs');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dest = path.resolve(process.cwd(), 'uploads');
		try {
			fs.mkdirSync(dest, { recursive: true });
		} catch (e) {
			// ignore
		}
		cb(null, dest);
	},
	filename: function (req, file, cb) {
		const safeName = `${Date.now()}-${file.originalname}`;
		cb(null, safeName);
	}
});

const upload = multer({ storage });

router.post('/', upload.single('pdf'), uploadFile);

export default router;