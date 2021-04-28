import express from 'express';

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
    console.log(req.method, req.url);
    return res.send('Hello World!');
};

const handleLogin = (req, res) => {
    return res.send('Login Here!');
};

app.get('/', handleHome);
app.get('/login', handleLogin);

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
