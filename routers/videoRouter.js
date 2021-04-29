import express from 'express';

const videoRouter = express.Router();

const handleVideos = (req, res) => res.send('Watch Videos');

videoRouter.get('/watch', handleVideos);

export default videoRouter;
