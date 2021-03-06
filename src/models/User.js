import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    socialOnly: { type: Boolean, default: false },
    avatarUrl: String,
    username: { type: String, required: true, unique: true },
    password: { type: String }, // social login 하면 password가 없을 가능성
    name: { type: String, required: true },
    location: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ], // 두 모델간의 관계는 양쪽 모델에서 지정해야 하며, 일대다 관계의 경우 한쪽에서는 array로 표현한다.
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
});

userSchema.pre('save', async function () {
    // isModified는 해당 항목이 수정되었을 때 true를 return한다.
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 5);
    }
}); // pre()는 User에 저장되는 모든 사항에 적용된다. 다만, findAndUpdate와 같은 사항에서는 적용되지 않는다.

const User = mongoose.model('User', userSchema);

export default User;
