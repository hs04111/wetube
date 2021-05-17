import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import userRouter from './routers/userRouter';
import rootRouter from './routers/rootRouter';
import videoRouter from './routers/videoRouter';
import { localsMiddleware } from './middlewares';

const logger = morgan('dev');
const app = express();
app.use(logger);

app.set('views', process.cwd() + '/src/views');
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

app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

export default app;
