import { render } from 'pug';
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

export const see = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
        return res.render('404', { pageTitle: 'Video Not Found' });
    }
    return res.render('watch', {
        pageTitle: video.title,
        video
    });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
        return res.render('404', { pageTitle: 'Video Not Found' });
    }

    return res.render('edit', {
        pageTitle: 'Editing:',
        video
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

    try {
        const video = new Video({
            title,
            description,
            hashtags: hashtags.split(',').map((word) => `#${word}`)
        });
        await video.save();
    } catch (error) {
        const errMessage = error._message;
        return res.render('upload', { pageTitle: 'Upload Video', errMessage });
    }

    return res.redirect('/');
};
