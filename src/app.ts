
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors'
import userRoutes from './api/v1/user/user.routes'
import shopRoutes from './api/v1/shop/shop.routes'
import { connect } from './config/database.config';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/shops', shopRoutes);

connect()
export default app;