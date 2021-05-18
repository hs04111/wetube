import express from 'express';
import {
    see,
    edit,
    logout,
    remove,
    startGithubLogin,
    finishGithubLogin
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/:id(\\d+)', see);
userRouter.get('/edit', edit);
userRouter.get('/logout', logout);
userRouter.get('/remove', remove);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/github/finish', finishGithubLogin);

export default userRouter;
