import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import userRouter from './routers/userRouter';
import rootRouter from './routers/rootRouter';
import videoRouter from './routers/videoRouter';

const logger = morgan('dev');
const app = express();
app.use(logger);

app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true })); // This makes app to understand the HTML Form
app.use(
    session({
        secret: 'Hello!',
        resave: true,
        saveUninitialized: true
    })
);

app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

export default app;
