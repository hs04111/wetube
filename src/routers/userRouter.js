import express from 'express';
import {
    see,
    getEdit,
    postEdit,
    logout,
    startGithubLogin,
    finishGithubLogin
} from '../controllers/userController';

import { protectorMiddleware, publicOnlyMiddleware } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/:id(\\d+)', see);
userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get('/logout', protectorMiddleware, logout);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);

export default userRouter;
