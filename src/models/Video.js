import mongoose from 'mongoose';

const videoSchema = mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80 },
    fileUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true, minLength: 20 },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ], // 두 모델간의 관계는 양쪽 모델에서 지정해야 하며, 일대다 관계의 경우 한쪽에서는 array로 표현한다.
    meta: {
        views: { type: Number, default: 0, required: true }
    }
});

videoSchema.static('formatHashtags', function (hashtags) {
    return hashtags
        .split(',')
        .map((word) => (word.startsWith('#') ? word : `#${word}`));
}); // 컨트롤러와 같은 곳에서 Video.formatHashtags()와 같은 형식으로 사용 가능하다. pre로 적용하면 모든 곳에서 적용되지 않으므로 static으로 함수를 새로 설정한다.

const Video = mongoose.model('Video', videoSchema);

export default Video;
