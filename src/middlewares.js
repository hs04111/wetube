import multer from 'multer'; // form에서 file을 받아 저장하고, req.file에 포함시키는 middleware
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    }
});

const multerUploader = multerS3({
    s3: s3,
    bucket: 'wetube-challenge-2021',
    acl: 'public-read'
});

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = 'Wetube';
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next();
}; // res.locals에는 어느 템플릿에서나 읽을 수 있는 변수를 담을 수 있다. 템플릿에서는 siteName, loggedIn으로 바로 사용 가능.

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        req.flash('error', 'Not authorized');
        return res.redirect('/login');
    }
}; // 로그인한 유저만 사용 가능한 페이지

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        req.flash('error', 'Not authorized');
        return res.redirect('/');
    }
}; // 로그인하지 않은 유저만 사용 가능한 페이지

export const avatarUpload = multer({
    dest: 'uploads/avatar/', // destination을 uploads/avatar folder로 하여 여기에 파일 저장
    limits: {
        fileSize: 3000000
    },
    storage: multerUploader
});

export const videoUpload = multer({
    dest: 'uploads/video/',
    limits: {
        fileSize: 100000000
    },
    storage: multerUploader
});
