import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const startBtn = document.getElementById('startBtn');
const video = document.getElementById('preview');

let stream;
let recorder;
let videoUrl;

const handleDownload = async () => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'Video.webm', await fetchFile(videoUrl));
    await ffmpeg.run('-i', 'Video.webm', '-r', '60', 'output.mp4');
    await ffmpeg.run(
        '-i',
        'Video.webm',
        '-ss',
        '00:00:01',
        '-frames:v',
        '1',
        'thumbnail.jpg'
    );

    const mp4File = ffmpeg.FS('readFile', 'output.mp4');
    const thumbFile = ffmpeg.FS('readFile', 'thumbnail.jpg');
    const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
    const thumbBlob = new Blob([thumbFile.buffer], { type: 'image/jpg' });
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    const a = document.createElement('a');
    a.href = mp4Url;
    a.download = 'Video.mp4';
    a.click();

    const thumbA = document.createElement('a');
    thumbA.href = thumbUrl;
    thumbA.download = 'MyThumbnail.jpg';
    thumbA.click();
};

const handleStop = () => {
    startBtn.innerText = 'Download';
    startBtn.removeEventListener('click', handleStop);
    startBtn.addEventListener('click', handleDownload);
    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = 'Stop Recording';
    startBtn.removeEventListener('click', handleStart);
    startBtn.addEventListener('click', handleStop);

    recorder = new MediaRecorder(stream); // 녹화를 시작한다. Method와 event handler에서 아래 코드를 찾아볼 수 있다. https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
    recorder.ondataavailable = (event) => {
        videoUrl = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoUrl;
        video.loop = true;
        video.play();
    };
    recorder.start();
};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        // 브라우저 사용자에게 허락받고 카메라로 들어오는 stream을 가져오는 함수 https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia
        audio: false,
        video: true
    });
    video.srcObject = stream; // HTMLmediaelement에게 src를 setting하는 법. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
    video.play();
};

init();

startBtn.addEventListener('click', handleStart);
