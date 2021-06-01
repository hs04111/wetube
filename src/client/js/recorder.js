import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const actionBtn = document.getElementById('actionBtn');
const video = document.getElementById('preview');

let stream;
let recorder;
let videoUrl;

const files = {
    input: 'Video.webm',
    output: 'output.mp4',
    thumb: 'thumbnail.jpg'
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    a.click();
};

const handleDownload = async () => {
    actionBtn.removeEventListener('click', handleDownload);
    actionBtn.disabled = true;
    actionBtn.innerText = 'Transcoding...';

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    ffmpeg.FS('writeFile', files.input, await fetchFile(videoUrl));
    await ffmpeg.run('-i', files.input, '-r', '60', files.output);
    await ffmpeg.run(
        '-i',
        files.input,
        '-ss',
        '00:00:01',
        '-frames:v',
        '1',
        files.thumb
    );

    const mp4File = ffmpeg.FS('readFile', files.output);
    const thumbFile = ffmpeg.FS('readFile', files.thumb);
    const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
    const thumbBlob = new Blob([thumbFile.buffer], { type: 'image/jpg' });
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, 'Video.mp4');
    downloadFile(thumbUrl, 'MyThumbnail.jpg');

    ffmpeg.FS('unlink', files.input);
    ffmpeg.FS('unlink', files.output);
    ffmpeg.FS('unlink', files.thumb);

    URL.revokeObjectURL(videoUrl);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);

    actionBtn.addEventListener('click', handleStart);
    actionBtn.disabled = false;
    actionBtn.innerText = 'Record again';
};

const handleStop = () => {
    actionBtn.innerText = 'Download';
    actionBtn.removeEventListener('click', handleStop);
    actionBtn.addEventListener('click', handleDownload);
    recorder.stop();
};

const handleStart = () => {
    actionBtn.innerText = 'Stop Recording';
    actionBtn.removeEventListener('click', handleStart);
    actionBtn.addEventListener('click', handleStop);

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

actionBtn.addEventListener('click', handleStart);
