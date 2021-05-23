import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;
const handleOpen = () => console.log('✔Connected to DB');

db.on('error', (error) => console.log('❌DB error', error));
db.once('open', handleOpen); // 콜백 형식으로 db를 시작한다. on은 계속 보고 있는 것, once는 시작할 때에만 나타나는 것.
