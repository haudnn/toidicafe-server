import express from 'express';
import { createPurpose, getListPurpose } from './purpose.controller';
import { fileUpload } from '../middlewares/fileUpload';
const router = express.Router();

router.post('/', fileUpload.single('image'),createPurpose);
router.get('/', getListPurpose);

export default router;