import express from 'express';

const userRouter = express.Router();

const handleLogin = (req, res) => res.send('Login Here!');

userRouter.get('/login', handleLogin);

export default userRouter;
