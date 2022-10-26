import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors'

import userRoutes from './api/v1/user/user.routes'
import shopRoutes from './api/v1/shop/shop.routes'
import benefitRoutes from './api/v1/benefit/benefit.routes'
import regionRoutes from './api/v1/region/region.routes'
import reviewRoutes from './api/v1/review/review.routes'
import tagRoutes from './api/v1/tag/tag.routes'
import purposeRoutes from './api/v1/purpose/purpose.routes'
import testRoutes from './api/v1/test/test.routes'
import commentRoutes from './api/v1/comment/comment.routes'
import { connect } from './config/database.config';
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/shops', shopRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/benefits', benefitRoutes );
app.use('/api/v1/regions', regionRoutes );
app.use('/api/v1/tags', tagRoutes );
app.use('/api/v1/purposes', purposeRoutes);
app.use('/api/v1/testapi', testRoutes);
app.use('/api/v1/comments', commentRoutes);
connect()

export default app;
