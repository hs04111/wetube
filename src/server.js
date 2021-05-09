import express from 'express';
import morgan from 'morgan';
import userRouter from './routers/userRouter';
import globalRouter from './routers/globalRouter';
import videoRouter from './routers/videoRouter';

const logger = morgan('dev');
const app = express();
app.use(logger);

app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true })); // This makes app to understand the HTML Form
app.use('/', globalRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

export default app;
