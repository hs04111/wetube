const videos = [
    {
        title: 'First Video',
        views: 13,
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
    res.render('watch', { pageTitle: `Watch ${video.title}!`, video });
};

export const search = (req, res) => res.send('Search Videos');
export const edit = (req, res) => res.send('Edit Videos');
export const deleteVideo = (req, res) => res.send('Delete Video');
export const upload = (req, res) => res.send('Upload Video');
