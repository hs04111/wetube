import Video from '../models/Video';

/*
export const home = (req, res) => {
    Video.find({}, (error, videos) => {
        res.render('home', { pageTitle: 'Home!', videos });
    });
};
*/

export const home = async (req, res) => {
    const videos = await Video.find({});
    res.render('home', { pageTitle: 'Home!', videos });
};

export const see = (req, res) => {
    const { id } = req.params;

    res.render('watch', {
        pageTitle: 'Watching:'
    });
};

export const getEdit = (req, res) => {
    const { id } = req.params;
    // const id = req.params.id

    return res.render('edit', {
        pageTitle: 'Editing:'
    });
};

export const postEdit = (req, res) => {
    const { id } = req.params;
    const title = req.body.title;

    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    const video = new Video({
        title,
        description,
        createdAt: Date.now(),
        hashtags: hashtags.split(',').map((word) => `#${word}`),
        meta: {
            views: 0,
            rating: 0
        }
    });
    await video.save();
    return res.redirect('/');
};
