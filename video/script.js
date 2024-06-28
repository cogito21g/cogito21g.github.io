document.addEventListener('DOMContentLoaded', () => {
    const itemsPerPage = 5;

    fetch('data/videos.json')
        .then(response => response.json())
        .then(data => {
            const navbar = document.getElementById('navbar');
            const content = document.getElementById('content');
            const tooltip = document.getElementById('tooltip');

            data.categories.forEach((category, categoryIndex) => {
                // Add category to navbar
                const navItem = document.createElement('li');
                const navLink = document.createElement('a');
                navLink.href = `#${category.name}`;
                navLink.textContent = category.name;
                navItem.appendChild(navLink);
                navbar.appendChild(navItem);

                // Create table container
                const tableContainer = document.createElement('div');
                tableContainer.id = category.name;
                content.appendChild(tableContainer);

                // Create table title
                const tableTitle = document.createElement('h2');
                tableTitle.textContent = category.name;
                tableContainer.appendChild(tableTitle);

                // Create table
                const table = document.createElement('table');
                tableContainer.appendChild(table);
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                // Table headers
                const headers = ['Title', 'Description', 'Link', 'Date'];
                const headerRow = document.createElement('tr');
                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);
                table.appendChild(tbody);

                // Create pagination container
                const pagination = document.createElement('div');
                pagination.className = 'pagination';
                tableContainer.appendChild(pagination);

                // Pagination buttons
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Prev';
                prevButton.addEventListener('click', () => changePage(categoryIndex, -1));
                pagination.appendChild(prevButton);

                const pageDisplay = document.createElement('span');
                pagination.appendChild(pageDisplay);

                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.addEventListener('click', () => changePage(categoryIndex, 1));
                pagination.appendChild(nextButton);

                // Display initial page
                displayPage(categoryIndex, 1);

                function changePage(categoryIndex, direction) {
                    const currentPage = parseInt(pageDisplay.textContent.split('/')[0]);
                    const totalPages = parseInt(pageDisplay.textContent.split('/')[1]);
                    const newPage = currentPage + direction;
                    if (newPage >= 1 && newPage <= totalPages) {
                        displayPage(categoryIndex, newPage);
                    }
                }

                function displayPage(categoryIndex, pageNum) {
                    const category = data.categories[categoryIndex];
                    const table = document.querySelector(`#${category.name} table tbody`);
                    table.innerHTML = ''; // Clear previous rows

                    const start = (pageNum - 1) * itemsPerPage;
                    const end = start + itemsPerPage;
                    const pageVideos = category.videos.slice(start, end);

                    pageVideos.forEach((video, videoIndex) => {
                        const row = document.createElement('tr');

                        const titleCell = document.createElement('td');
                        titleCell.textContent = video.title;
                        row.appendChild(titleCell);

                        const descriptionCell = document.createElement('td');
                        descriptionCell.textContent = video.description;
                        descriptionCell.className = 'description';
                        row.appendChild(descriptionCell);

                        const linkCell = document.createElement('td');
                        const link = document.createElement('a');
                        link.href = `detail.html?category=${categoryIndex}&video=${start + videoIndex}`;
                        link.textContent = "View Video";
                        linkCell.appendChild(link);
                        row.appendChild(linkCell);

                        const dateCell = document.createElement('td');
                        dateCell.textContent = video.date;
                        row.appendChild(dateCell);

                        table.appendChild(row);
                    });

                    const totalPages = Math.ceil(category.videos.length / itemsPerPage);
                    pageDisplay.textContent = `${pageNum}/${totalPages}`;
                }
            });

            // Smooth scroll to section
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        })
        .catch(error => console.error('Error loading videos:', error));
});
