const fakeUser = {
    username: 'Ong',
    loggedIn: false
};

export const trending = (req, res) =>
    res.render('home', { pageTitle: 'Home!', fakeUser });
export const see = (req, res) =>
    res.render('watch', { pageTitle: 'Watch Video!' });
export const search = (req, res) => res.send('Search Videos');
export const edit = (req, res) => res.send('Edit Videos');
export const deleteVideo = (req, res) => res.send('Delete Video');
export const upload = (req, res) => res.send('Upload Video');
