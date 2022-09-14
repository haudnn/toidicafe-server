import express from 'express';
import { testapi} from './test.controller';
import { fileUpload } from '../middlewares/fileUpload';
const router = express.Router();
router.post('/' , testapi);

export default router;