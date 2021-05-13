export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });
export const postJoin = (req, res) => res.render('join', { pageTitle: 'Join' });
export const login = (req, res) => res.send('Login Here!');
export const edit = (req, res) => res.send('Edit Here!');
export const see = (req, res) => {
    console.log(req.params.id);
    res.send('See Users');
};
export const logout = (req, res) => res.send('Log Out');
export const remove = (req, res) => res.send('Delete User');
