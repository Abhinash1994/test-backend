import express from 'express';
import { authRouter } from './resources/auth'
import { categoryRouter } from './resources/category'
import { productRouter } from './resources/product'


 
export const restRouter = express.Router();
restRouter.use('/user', authRouter);
restRouter.use('/category', categoryRouter);
restRouter.use('/product', productRouter);

