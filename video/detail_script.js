document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryIndex = urlParams.get('category');
    const videoIndex = urlParams.get('video');

    fetch('data/videos.json')
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            const category = data.categories[categoryIndex];
            const video = category.videos[videoIndex];

            if (video) {
                const videoFrame = document.createElement('iframe');
                const videoUrl = new URL(video.link);
                const videoId = videoUrl.searchParams.get('v');
                videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
                videoFrame.frameBorder = 0;
                videoFrame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                videoFrame.allowFullscreen = true;

                const videoTitle = document.createElement('h2');
                videoTitle.textContent = video.title;

                const videoDescription = document.createElement('p');
                videoDescription.textContent = video.description;

                content.appendChild(videoFrame);
                content.appendChild(videoTitle);
                content.appendChild(videoDescription);
            } else {
                content.textContent = 'Video not found.';
            }
        })
        .catch(error => console.error('Error loading video details:', error));

    // Back to main page button
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
