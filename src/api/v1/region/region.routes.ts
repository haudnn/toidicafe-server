import express from 'express';
import { createRegion, getListRegion, updateRegion } from './region.controller';
import { fileUpload } from '../middlewares/fileUpload';
const router = express.Router();

router.post('/', fileUpload.single('image'),createRegion);
router.get('/', getListRegion);
router.patch('/:id', updateRegion )
export default router;