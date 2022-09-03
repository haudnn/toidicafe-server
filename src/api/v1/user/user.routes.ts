import express from 'express';
import { register, login, refreshToken } from './user.controller';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router