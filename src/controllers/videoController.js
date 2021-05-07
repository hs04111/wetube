const videos = [
    {
        title: 'First Video',
        views: 1,
        id: 1
    },
    {
        title: 'Second Video',
        views: 13,
        id: 2
    },
    {
        title: 'Third Video',
        views: 13,
        id: 3
    }
];

export const trending = (req, res) =>
    res.render('home', { pageTitle: 'Home!', videos });

export const see = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render('watch', {
        pageTitle: `Watching: ${video.title}!`,
        video
    });
};

export const getEdit = (req, res) => {
    const { id } = req.params;
    // const id = req.params.id
    const video = videos[id - 1];
    return res.render('edit', {
        pageTitle: `Editing: ${video.title}!`,
        video
    });
};

export const postEdit = (req, res) => {
    const { id } = req.params;
    const title = req.body.title;
    videos[id - 1].title = title;
    return res.redirect(`/videos/${id}`);
};
