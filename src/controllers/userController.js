import User from '../models/User';

export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });
export const postJoin = async (req, res) => {
    const { name, email, password, password2, location, username } = req.body;
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (password !== password2) {
        const errMessage = 'Password confirmation does not match';
        return res
            .status(400)
            .render('join', { pageTitle: 'Join', errMessage });
    }
    if (exists) {
        const errMessage = 'The username/email already exists';
        return res
            .status(400)
            .render('join', { pageTitle: 'Join', errMessage });
    }
    await User.create({
        name,
        email,
        password,
        location,
        username
    });

    res.redirect('/login');
};
export const login = (req, res) => res.send('Login Here!');
export const edit = (req, res) => res.send('Edit Here!');
export const see = (req, res) => {
    console.log(req.params.id);
    res.send('See Users');
};
export const logout = (req, res) => res.send('Log Out');
export const remove = (req, res) => res.send('Delete User');
