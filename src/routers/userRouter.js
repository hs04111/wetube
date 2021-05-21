import express from 'express';
import {
    see,
    getEdit,
    postEdit,
    logout,
    startGithubLogin,
    finishGithubLogin,
    getChangePassword,
    postChangePassword
} from '../controllers/userController';

import { protectorMiddleware, publicOnlyMiddleware } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/:id(\\d+)', see);
userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get('/logout', protectorMiddleware, logout);
userRouter
    .route('/change-password')
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);

export default userRouter;
