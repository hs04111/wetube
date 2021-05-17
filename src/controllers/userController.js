import User from '../models/User';
import bcrypt from 'bcrypt';

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
    try {
        await User.create({
            name,
            email,
            password,
            location,
            username
        });
    } catch (error) {
        const errMessage = error._message;
        return res
            .status(400)
            .render('join', { pageTitle: 'Join', errMessage });
    }

    res.redirect('/login');
};
export const getLogin = (req, res) => {
    res.render('login', { pageTitle: 'Log In' });
};

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const pageTitle = 'Log In';
    if (!user) {
        return res.status(400).render('login', {
            pageTitle,
            errMessage: 'An account with this username does not exist.'
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render('login', {
            pageTitle,
            errMessage: 'Wrong Password'
        });
    }

    res.redirect('/');
};

export const edit = (req, res) => res.send('Edit Here!');
export const see = (req, res) => {
    console.log(req.params.id);
    res.send('See Users');
};
export const logout = (req, res) => res.send('Log Out');
export const remove = (req, res) => res.send('Delete User');
