import express from 'express';
import { uploadFile, uploadMultiple } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Protect all upload routes
router.use(protect);

router.post('/single', upload.single('file'), uploadFile);
router.post('/multiple', upload.array('files', 10), uploadMultiple);

export default router;
