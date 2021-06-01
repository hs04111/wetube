import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const actionBtn = document.getElementById('actionBtn');
const video = document.getElementById('preview');

// 다른 함수에서도 아래 값을 공유하기 위해, global로 변수를 선언한다.

let stream;
let recorder;
let videoUrl;

// 헷갈릴 수 있으므로, 파일명 등은 오브젝트를 형성하여 기록한다.
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

    // ffmpeg를 사용하여 webm을 mp4로 전환한다.

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    ffmpeg.FS('writeFile', files.input, await fetchFile(videoUrl));
    await ffmpeg.run('-i', files.input, '-r', '60', files.output); // 프레임 60의 mp4로 전환
    await ffmpeg.run(
        '-i',
        files.input,
        '-ss',
        '00:00:01',
        '-frames:v',
        '1',
        files.thumb
    ); // 1초로 이동하여 1프레임의 스크린샷 촬영

    // readFile을 통해 파일을 시스템으로 가져온다.
    const mp4File = ffmpeg.FS('readFile', files.output);
    const thumbFile = ffmpeg.FS('readFile', files.thumb);

    // blob을 형성하여 javascript에서 파일에 url을 부여할 수 있도록 한다. 이때, file.buffer를 사용하여 raw data를 입력하도록 한다.
    const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
    const thumbBlob = new Blob([thumbFile.buffer], { type: 'image/jpg' });
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    // 다운로드 a를 형성하여 클릭.
    downloadFile(mp4Url, 'Video.mp4');
    downloadFile(thumbUrl, 'MyThumbnail.jpg');

    // 사용이 끝난 파일과 url은 아래와 같이 폐기한다.
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

const handleStart = () => {
    actionBtn.innerText = 'Recording';
    actionBtn.disabled = true;
    actionBtn.removeEventListener('click', handleStart);

    recorder = new MediaRecorder(stream); // 녹화를 시작한다. Method와 event handler에서 아래 코드를 찾아볼 수 있다. https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
    recorder.ondataavailable = (event) => {
        videoUrl = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoUrl;
        video.loop = true;
        video.play();
        actionBtn.innerText = 'Download';
        actionBtn.disabled = false;
        actionBtn.addEventListener('click', handleDownload);
    };
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 5000);
};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        // 브라우저 사용자에게 허락받고 카메라로 들어오는 stream을 가져오는 함수 https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia
        audio: false,
        video: {
            width: 1024,
            height: 576
        }
    });
    video.srcObject = stream; // HTMLmediaelement에게 src를 setting하는 법. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
    video.play();
};

init();

actionBtn.addEventListener('click', handleStart);
