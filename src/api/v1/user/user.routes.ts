import express from 'express';
import { signup, login, refreshToken } from './user.controller';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router