document.addEventListener('DOMContentLoaded', () => {
    // 페이지가 로드되면 실행될 함수
    const urlParams = new URLSearchParams(window.location.search);
    const categoryIndex = urlParams.get('category'); // URL에서 category 매개변수 가져오기
    const videoIndex = urlParams.get('video'); // URL에서 video 매개변수 가져오기

    // 비디오 데이터를 담고 있는 JSON 파일 가져오기
    fetch('data/videos.json')
        .then(response => response.json()) // JSON 데이터로 변환
        .then(data => {
            const content = document.getElementById('content'); // 컨텐츠를 표시할 요소 가져오기
            const category = data.categories[categoryIndex]; // 선택한 카테고리의 데이터 가져오기
            const video = category.videos[videoIndex]; // 선택한 비디오의 데이터 가져오기

            if (video) {
                // 비디오가 존재할 경우 iframe으로 비디오 플레이어 추가
                const videoFrame = document.createElement('iframe');
                const videoUrl = new URL(video.link);
                const videoId = videoUrl.searchParams.get('v');
                videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
                videoFrame.frameBorder = 0;
                videoFrame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                videoFrame.allowFullscreen = true;

                // 비디오 제목을 나타내는 요소 추가
                const videoTitle = document.createElement('h2');
                videoTitle.textContent = video.title;

                // 비디오 설명을 나타내는 요소 추가
                const videoDescription = document.createElement('p');
                videoDescription.textContent = video.description;

                // 컨텐츠에 추가
                content.appendChild(videoFrame);
                content.appendChild(videoTitle);
                content.appendChild(videoDescription);
            } else {
                // 비디오가 없을 경우 메시지 표시
                content.textContent = 'Video not found.';
            }
        })
        .catch(error => console.error('Error loading video details:', error));

    // Back 버튼 클릭 시 메인 페이지로 이동하는 이벤트 리스너 추가
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
