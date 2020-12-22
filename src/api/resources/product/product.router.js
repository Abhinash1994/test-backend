import express from 'express';
import productController from './product.controller';
// import { jwtStrategy } from '../../../middleware/strategy';
import { sanitize } from '../../../middleware/sanitizer';
import upload from '../../../awsbucket';


export const productRouter = express.Router();
productRouter.route('/add').post(sanitize(), upload.single('photo'), productController.addProduct);
productRouter.route('/getAllproduct').get(sanitize(), productController.index);











