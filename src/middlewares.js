export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = 'Wetube';
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next();
}; // req.locals에는 어느 템플릿에서나 읽을 수 있는 변수를 담을 수 있다. 템플릿에서는 siteName, loggedIn으로 바로 사용 가능.

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect('/');
    }
};
