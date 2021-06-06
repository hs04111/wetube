import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    createdAt: { type: Date, default: Date.now, required: true }
});

const Comment = mongoose.model('Comment', commentSchema); // 참고로 처음에 들어가는 'Comment'는 다른 모델과의 relationship에 사용된다.

export default Comment;
