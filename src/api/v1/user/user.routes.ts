import express from 'express';
import verifyToken from '../middlewares/verifyToken';
import { register, login, refreshToken, currentUser } from './user.controller';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// router.use(verifyToken);
router.post('/', verifyToken, currentUser)

export default router