import Video from '../models/Video';

export const home = (req, res) => {
    Video.find({}, (error, videos) => {
        console.log('Searching videos');
        res.render('home', { pageTitle: 'Home!', videos });
    });
};

export const see = (req, res) => {
    const { id } = req.params;

    return res.render('watch', {
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

export const postUpload = (req, res) => {
    const title = req.body.title;

    const views = 0;

    return res.redirect('/');
};
