document.addEventListener('DOMContentLoaded', () => {
    fetch('images.json')
        .then(response => response.json())
        .then(data => {
            const galleryContainer = document.getElementById('gallery-container');
            data.images.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.classList.add('gallery-item');
                
                const imgElement = document.createElement('img');
                imgElement.src = `images/${image.fileName}`;
                imgElement.alt = image.title;

                const artInfo = document.createElement('div');
                artInfo.classList.add('art-info');

                const titleElement = document.createElement('h2');
                titleElement.textContent = image.title;

                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = image.description;

                artInfo.appendChild(titleElement);
                artInfo.appendChild(descriptionElement);
                galleryItem.appendChild(imgElement);
                galleryItem.appendChild(artInfo);
                galleryContainer.appendChild(galleryItem);
            });
        })
        .catch(error => console.error('Error loading images:', error));
});
