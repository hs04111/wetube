const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const volumeRange = document.getElementById('volume');
const timeRange = document.getElementById('timeline');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const fullscreenBtn = document.getElementById('fullscreen');
const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');

// 대부분의 비디오 컨트롤은 HTML의 video element 부분을 참조하여 작성한다. 이는 MediaElement를 상속한 것이다. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

let volumeValue = 0.5;
let controlsTimeout = null;
let controlsMovementTimeout = null;
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

const handleTimeChange = (event) => {
    const {
        target: { value }
    } = event;
    video.currentTime = value * video.duration; // video.currentTime이 read only가 아니기 때문에 이렇게 자바스크립트에서 변경이 가능.
};

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(11, 8);

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration)); // video의 properties 참조
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime)); // video의 properties 참조
    timeRange.value = video.currentTime / video.duration;
};

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement; // 현재 document에 fullscreen인 element를 보여준다. 없으면 null.

    if (fullscreen) {
        document.exitFullscreen(); // document에서 가능하다는 것을 주의한다.
        fullscreenBtn.innerText = 'Enter Full Screen';
    } else {
        videoContainer.requestFullscreen();
        fullscreenBtn.innerText = 'Exit Full Screen';
    }
};

const hideControls = () => videoControls.classList.remove('showing');

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
    }
    controlsMovementTimeout = setTimeout(hideControls, 3000);
    videoControls.classList.add('showing');
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener('click', handlePlayClick);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleVolumeChange);
video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
timeRange.addEventListener('input', handleTimeChange);
fullscreenBtn.addEventListener('click', handleFullscreen);
video.addEventListener('mousemove', handleMouseMove);
video.addEventListener('mouseleave', handleMouseLeave);
// video.addEventListener('play', handlePlay);  play와 pause에 대하여, video elemet의 event들을 참조할 것. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
