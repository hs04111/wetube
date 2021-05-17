import 'dotenv/config'; // 만약 require('dotenv').config()로 불러온다면 server.js 등 각 파일 위에 전부 써주어야 한다.
import './db';
import './models/Video';
import './models/User';
import app from './server.js';

const PORT = 4000;

const handleListening = () =>
    console.log(`✔Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
