import express from 'express';
import { login, edit } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/login', login);
userRouter.get('/edit', edit);

export default userRouter;
