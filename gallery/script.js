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

                // Add click event listener to image
                imgElement.addEventListener('click', () => {
                    showModal(imgElement.src, image.title, image.description);
                });
            });
        })
        .catch(error => console.error('Error loading images:', error));
});

const showModal = (src, title, description) => {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('caption');
    modal.style.display = 'block';
    modalImg.src = src;
    captionText.innerHTML = `<h2>${title}</h2><p>${description}</p>`;
}

// Get the modal
const modal = document.getElementById('modal');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// When the user clicks on <span> (x), close the modal
span.onclick = () => {
    modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
