import express from 'express';
import {
    see,
    getEdit,
    postEdit,
    getUpload,
    postUpload,
    deleteVideo
} from '../controllers/videoController';
import { protectorMiddleware, videoUpload } from '../middlewares';

const videoRouter = express.Router();

videoRouter.get('/:id([0-9a-f]{24})', see);
videoRouter
    .route('/:id([0-9a-f]{24})/edit')
    .all(protectorMiddleware)
    .get(getEdit)
    .post(postEdit);
videoRouter
    .route('/:id([0-9a-f]{24})/delete')
    .all(protectorMiddleware)
    .get(deleteVideo);
videoRouter
    .route('/upload')
    .all(protectorMiddleware)
    .get(getUpload)
    .post(
        videoUpload.fields([
            { name: 'video', maxCount: 1 },
            { name: 'thumb', maxCount: 1 }
        ]),
        postUpload
    ); //  single이 아닌 fields를 이용하여 하나의 form에서 다양한 file을 받는다.

export default videoRouter;
