const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const time = document.getElementById('time');
const volumeRange = document.getElementById('volume');

// 대부분의 비디오 컨트롤은 HTML의 video element 부분을 참조하여 작성한다. 이는 MediaElement를 상속한 것이다. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

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

    volumeRange.value = video.muted ? 0 : 0.5;
    muteBtn.innerText = video.muted ? 'Unmute' : 'Mute';
};

playBtn.addEventListener('click', handlePlayClick);
muteBtn.addEventListener('click', handleMute);
// video.addEventListener('play', handlePlay);  play와 pause에 대하여, video elemet의 event들을 참조할 것. https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
