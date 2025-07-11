import express from 'express';
import pkj from 'body-parser';
import { usersRouter } from './routes/users.js';
import { reviewsRouter } from './routes/reviews.js';
import { corsMiddleware } from './middleware/cors.js';

const { json } = pkj;
const app = express();
app.use(corsMiddleware());
app.use(json());

app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
});