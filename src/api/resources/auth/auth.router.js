import express from 'express';
import authController from './auth.controller';
import { localStrategy } from '../../../middleware/strategy';

// import multer from 'multer';
// import path from 'path';
import { sanitize } from '../../../middleware/sanitizer';
import { validateBody, schemas } from '../../../middleware/validator';


export const authRouter = express.Router();
authRouter.route('/register').post(sanitize(), authController.register);
authRouter.route('/login').post(sanitize(),validateBody(schemas.loginSchema),localStrategy, authController.login);




