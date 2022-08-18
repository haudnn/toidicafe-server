import express from 'express';
const router = express.Router();
import { fileUpload }from '../middlewares/fileUpload'
import { createShop, updateShop } from './shop.controller'

router.post('/', fileUpload.array("image"), createShop );
router.patch('/:shopId', fileUpload.array("image"), updateShop );
export default router