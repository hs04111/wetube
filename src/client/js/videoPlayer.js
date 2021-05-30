const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const playBtnIcon = playBtn.querySelector('i');
const muteBtn = document.getElementById('mute');
const muteBtnIcon = muteBtn.querySelector('i');
const volumeRange = document.getElementById('volume');
const timeRange = document.getElementById('timeline');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const fullScreenBtn = document.getElementById('fullscreen');
const fullScreenIcon = fullScreenBtn.querySelector('i');
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

    playBtnIcon.classList = video.paused ? 'fas fa-play' : 'fas fa-pause';
};

const handleKeyPush = (event) => {
    if (event.keyCode === 32) {
        handlePlayClick();
    }
};

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }

    volumeRange.value = video.muted ? 0 : volumeValue;
    muteBtnIcon.classList = video.muted
        ? 'fas fa-volume-mute'
        : 'fas fa-volume-up';
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
    new Date(seconds * 1000).toISOString().substr(14, 5);

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
        fullScreenIcon.classList = 'fas fa-expand';
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = 'fas fa-compress';
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

document.body.onkeyup = handleKeyPush;
playBtn.addEventListener('click', handlePlayClick);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleVolumeChange);
video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('click', handlePlayClick);
timeRange.addEventListener('input', handleTimeChange);
fullScreenBtn.addEventListener('click', handleFullscreen);
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
// video.addEventListener('play', handlePlay);  play와 pause에 대하여, video elemet의 event들을 참조할 것. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
