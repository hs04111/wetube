const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const volumeRange = document.getElementById('volume');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');

// 대부분의 비디오 컨트롤은 HTML의 video element 부분을 참조하여 작성한다. 이는 MediaElement를 상속한 것이다. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    if (video.paused) {
        // video.paused는 video element가 멈춰있으면 true를 return한다.
        video.play(); // video element의 method로, video를 재생시킨다.
    } else {
        video.pause();
    }

    playBtn.innerText = video.paused ? 'Play' : 'Pause';
};

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }

    volumeRange.value = video.muted ? 0 : volumeValue;
    muteBtn.innerText = video.muted ? 'Unmute' : 'Mute';
};

const handleVolumeChange = (event) => {
    const {
        target: { value }
    } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = 'Mute';
    }
    volumeValue = value;
    video.volume = value;
};

const handleLoadedMetaData = () => {
    totalTime.innerText = Math.floor(video.duration); // video의 properties 참조
};

const handleTimeUpdate = () => {
    currentTime.innerText = Math.floor(video.currentTime); // video의 properties 참조
};

playBtn.addEventListener('click', handlePlayClick);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleVolumeChange);
video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
// video.addEventListener('play', handlePlay);  play와 pause에 대하여, video elemet의 event들을 참조할 것. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
