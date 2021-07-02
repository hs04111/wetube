import regeneratorRuntime from 'regenerator-runtime';
import 'dotenv/config'; // 만약 require('dotenv').config()로 불러온다면 server.js 등 각 파일 위에 전부 써주어야 한다.
import './db'; // 이렇게 파일을 import하는 것은 해당 파일의 모든 코드를 여기로 붙여넣기 한다고 생각하면 편하다.
import './models/Video';
import './models/User';
import './models/Comment';
import app from './server.js';

const PORT = process.env.PORT || 4000;

const handleListening = () =>
    console.log(`✔Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
