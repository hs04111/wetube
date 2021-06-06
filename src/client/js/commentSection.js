const { default: fetch } = require('node-fetch');

const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const handleSubmit = (event) => {
    const textarea = form.querySelector('textarea'); // form이 존재할 때에만 textarea를 가져오도록 함수 안으로 집어넣었다.
    event.preventDefault(); // form의 submit은 브라우저를 refresh한다. 이를 방지. 참고로 a태그는 기본 기능은 해당 링크로 이동하는 것.
    // comment의 모델에 포함된 4가지 요소를 DB에 저장시킬 준비를 한다. owner는 req.session으로 백엔드에서 바로 볼 수 있다. createdAt은 자동으로 주어진다.
    const text = textarea.value;
    const videoId = videoContainer.dataset.id; // 이거 비디오의 조회수 할 때 다루었음. 백엔드에서 data-id로 attribute를 설정하여 템플릿에 값을 주면 프론트엔드에서 dataset으로 값을 가져올 수 있다.
    // express.json() 미들웨어의 도움을 받기 위해서는 우리도 headers에 json을 보내고 있음을 반드시 명시해야 한다. 또한 해당 데이터는 JSON.stringify에 object 형태로 넣는다.
    // JSON.stringify를 쓰지 않으면 브라우저가 JS object를 지맘대로 toString()해서 이상한 형태로 보내지고 만다.
    fetch(`/api/videos/${videoId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });
    textarea.value = '';
};

// 로그인 안하면 form이 없으므로, 있는 경우에만 작동하도록 해야 한다.
if (form) {
    form.addEventListener('submit', handleSubmit); // btn의 'click'에 리스너를 달 수도 있지만, 어쨌든 form 안에서 btn의 클릭은 form의 submit으로 이어진다.
}
