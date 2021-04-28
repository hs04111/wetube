import express from 'express';
import morgan from 'morgan';

const PORT = 4000;
const logger = morgan('dev')

const app = express();

const handleHome = (req, res) => {
    return res.send('Hello World!');
};

app.use(logger);
app.get('/', handleHome);

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
