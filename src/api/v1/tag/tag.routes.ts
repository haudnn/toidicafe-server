import express from 'express';
import { createTag, getListTag } from './tag.controller';
const router = express.Router();
router.post('/', createTag);
router.get('/', getListTag);
export default router;