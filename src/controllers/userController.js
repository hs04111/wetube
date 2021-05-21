import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

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
    const user = await User.findOne({ username, socialOnly: false });
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

    req.session.loggedIn = true;
    req.session.user = user;

    res.redirect('/');
};

export const startGithubLogin = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GH_ID,
        scope: 'read:user user:email',
        allow_signup: false
    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id: process.env.GH_ID,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (
        await fetch(finalUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            }
        })
    ).json(); // Nodejs에는 fetch가 없어 node-fetch를 install한다

    if ('access_token' in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = 'https://api.github.com';
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                method: 'GET',
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        console.log(userData);
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                method: 'GET',
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );

        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                name: userData.name ? userData.name : 'Unknown',
                username: userData.login,
                avatarUrl: userData.avatar_url
                    ? userData.avatar_url
                    : 'Unknown',
                email: emailObj.email,
                password: '',
                socialOnly: true,
                location: userData.location
            });
        }

        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
    } else {
        return res.redirect('/login');
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};
export const getEdit = (req, res) => {
    res.render('edit-profile', { pageTitle: 'Edit Profile' });
};

export const postEdit = async (req, res) => {
    const {
        body: { name, email, username, location },
        session: {
            user: { _id }
        }
    } = req;
    const sessionEmail = req.session.user.email;
    const sessionUsername = req.session.user.username;

    if (sessionEmail !== email) {
        const emailExists = await User.exists({ email });
        if (emailExists) {
            const errMessage = 'The email already exists';
            return res.status(400).render('edit-profile', {
                pageTitle: 'Edit profile',
                errMessage
            });
        }
    }

    if (sessionUsername !== username) {
        const usernameExists = await User.exists({ username });
        if (usernameExists) {
            const errMessage = 'The username already exists';
            return res.status(400).render('edit-profile', {
                pageTitle: 'Edit profile',
                errMessage
            });
        }
    }
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            name,
            email,
            username,
            location
        },
        {
            new: true
        }
    );
    req.session.user = updatedUser;
    return res.redirect('/users/edit');
};
export const see = (req, res) => {
    console.log(req.params.id);
    res.send('See Users');
};
