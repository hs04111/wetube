import Video from '../models/Video';
import User from '../models/User';

/*
export const home = (req, res) => {
    Video.find({}, (error, videos) => {
        res.render('home', { pageTitle: 'Home!', videos });
    });
};
*/

export const home = async (req, res) => {
    const videos = await Video.find({})
        .sort({ createdAt: 'desc' })
        .populate('owner');
    res.render('home', { pageTitle: 'Home!', videos });
};

export const see = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate('owner'); // populate()를 하면 vidoe의 owner 자리에 해당 objectid를 가진 user의 정보가 그대로 들어간다.

    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    return res.render('videos/watch', {
        pageTitle: video.title,
        video
    });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const {
        user: { _id }
    } = req.session;

    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect('/');
    }
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }

    return res.render('videos/edit', {
        pageTitle: 'Editing:',
        video
    });
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    const {
        user: { _id }
    } = req.session;

    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect('/');
    }

    if (!video) {
        return res.render('404', { pageTitle: 'Video Not Found' });
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags)
    });

    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render('videos/upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res) => {
    const { user: _id } = req.session;
    const { title, description, hashtags } = req.body;
    const file = req.file;

    try {
        const newVideo = await Video.create({
            title,
            fileUrl: file.path,
            description,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags)
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id); // user.videos는 array이므로 push를 통해 추가한다.
        user.save();
    } catch (error) {
        const errMessage = error._message;
        return res
            .status(400)
            .render('videos/upload', { pageTitle: 'Upload Video', errMessage });
    }

    return res.redirect('/');
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id }
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.render('404', { pageTitle: 'Video Not Found' });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: { $regex: new RegExp(keyword, 'i') }
        }).populate('owner');
    }
    return res.render('videos/search', { pageTitle: 'Search', videos });
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404); // sendStatus를 사용해야 연결이 끝난다. status는 단순히 상태코드를 덧붙이는 것.
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};
