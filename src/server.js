import express from 'express';
import morgan from 'morgan'; // express에서 사용자 기록을 콘솔에 보여주는 middleware
import session from 'express-session'; // express에서 session을 사용할 수 있게 해주는 middleware
import MongoStore from 'connect-mongo'; // session의 데이터를 저장할 수 있는 곳
import userRouter from './routers/userRouter';
import rootRouter from './routers/rootRouter';
import videoRouter from './routers/videoRouter';
import apiRouter from './routers/apiRouter';
import { localsMiddleware } from './middlewares';

const logger = morgan('dev'); // dev 말고도 많은 방식으로 logging을 할 수 있다.
const app = express();
app.use(logger);

app.set('views', process.cwd() + '/src/views'); // template file을 저장할 위치
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true })); // This makes app to understand the HTML Form
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false, // if it is false, it only gives cookies when the sesssion is modified. we only modify session in Login.
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL
        })
    })
);
app.use(localsMiddleware);
app.use('/uploads', express.static('uploads')); // user avatarUrl의 path에 있는 파일을 express가 브라우저로 보낼 수 있도록 하는 middleware
app.use('/static', express.static('assets')); // 폴더명과 url이 같을 필요는 없다.
app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);
app.use('/api', apiRouter);

export default app;
