import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

export const getJoin = (req, res) =>
    res.render('users/join', { pageTitle: 'Join' });
export const postJoin = async (req, res) => {
    const { name, email, password, password2, location, username } = req.body;
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (password !== password2) {
        const errMessage = 'Password confirmation does not match';
        return res
            .status(400)
            .render('users/join', { pageTitle: 'Join', errMessage });
    }
    if (exists) {
        const errMessage = 'The username/email already exists';
        return res
            .status(400)
            .render('users/join', { pageTitle: 'Join', errMessage });
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
            .render('users/join', { pageTitle: 'Join', errMessage });
    }

    res.redirect('/login');
};
export const getLogin = (req, res) => {
    res.render('users/login', { pageTitle: 'Log In' });
};

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, socialOnly: false });
    const pageTitle = 'Log In';
    if (!user) {
        return res.status(400).render('users/login', {
            pageTitle,
            errMessage: 'An account with this username does not exist.'
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render('users/login', {
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
    res.render('users/edit-profile', { pageTitle: 'Edit Profile' });
};

export const postEdit = async (req, res) => {
    const {
        body: { name, email, username, location },
        session: {
            user: { _id, avatarUrl }
        },
        file
    } = req;

    // 아래의 코드는  세션에 포함된 기존의 유저 정보와 form에서 온 정보를 비교하여 바뀐 것을 체크하여,
    // 바뀐 것은 DB의 다른 유저 정보와 비교하여 중복이 없는지 체크한 후 저장하는 과정

    const sessionEmail = req.session.user.email;
    const sessionUsername = req.session.user.username;

    if (sessionEmail !== email) {
        const emailExists = await User.exists({ email });
        if (emailExists) {
            const errMessage = 'The email already exists';
            return res.status(400).render('users/edit-profile', {
                pageTitle: 'Edit profile',
                errMessage
            });
        }
    }

    if (sessionUsername !== username) {
        const usernameExists = await User.exists({ username });
        if (usernameExists) {
            const errMessage = 'The username already exists';
            return res.status(400).render('users/edit-profile', {
                pageTitle: 'Edit profile',
                errMessage
            });
        }
    }
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            name,
            avatarUrl: file ? file.path : avatarUrl, // 유저가 file을 update하는지 여부를 확인하는 코드.
            email,
            username,
            location
        },
        {
            new: true // 이 옵션이 들어가지 않으면 findByIdAndUpdate가 업데이트된 user를 return하지 않아서, 아래 코드가 제대로 작동하지 않는다.
        }
    );

    req.session.user = updatedUser;
    return res.redirect('/users/edit');
};

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly) {
        return res.redirect('/');
    }
    return res.render('users/change-password', {
        pageTitle: 'Change Password'
    });
};

export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPasswordConfirmation },
        session: {
            user: { _id }
        }
    } = req;
    const user = await User.findById(_id);

    if (newPassword !== newPasswordConfirmation) {
        const errMessage = 'Password confirmation failed';
        return res.status(400).render('users/change-password', {
            pageTitle: 'Change profile',
            errMessage
        });
    }

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
        const errMessage = 'The current password is incorrect';
        return res.status(400).render('users/change-password', {
            pageTitle: 'Change profile',
            errMessage
        });
    }
    user.password = newPassword;
    user.save(); // 다만 기존의 pre에서 정의된 것 때문에 비밀번호가 다시 hash되어버린다. pre에서 isModified를 사용.
    req.session.user.password = user.password;
    return res.redirect('/');
};

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: 'videos',
        populate: {
            path: 'owner',
            model: 'User'
        }
    }); // 마찬가지로 videos array에 있는 objectID를 모두 실제 db의 video로 바꾸어준다. 거기에 더하여, video의 owner까지 채운다.
    if (!user) {
        return res.status(404).render('404', { pageTitle: 'User not found' });
    }

    return res.render('users/profile', {
        pageTitle: user.name,
        user
    });
};
