import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';

import { errors } from 'celebrate';

import { errorMiddleware } from './middlewares/error';
import modules from '~/routes';

const app = express();


app.use(express.json());

app.use('/api/v1', modules);

app.use(errors());
app.use(errorMiddleware);

export default app;
