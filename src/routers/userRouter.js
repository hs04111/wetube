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

import {
    protectorMiddleware,
    publicOnlyMiddleware,
    uplaodFiles
} from '../middlewares';

const userRouter = express.Router();

userRouter.get('/:id(\\d+)', see);
userRouter
    .route('/edit')
    .all(protectorMiddleware)
    .get(getEdit)
    .post(uplaodFiles.single('avatar'), postEdit); // single은 하나의 파일만 받는다. 괄호 안에는 template에서 file을 받는 input의 name을 적어야 한다.
userRouter.get('/logout', protectorMiddleware, logout);
userRouter
    .route('/change-password')
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);

export default userRouter;
