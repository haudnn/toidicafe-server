import express from 'express';
import { createBenefit, getListBenefit } from './benefit.controller';
const router = express.Router();
router.post('/', createBenefit);
router.get('/', getListBenefit);
export default router;