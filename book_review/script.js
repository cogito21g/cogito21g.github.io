let booksData = [];

document.addEventListener('DOMContentLoaded', function() {
    const bookList = document.getElementById('book-list');
    if (bookList) {
        loadBooks();
    } else {
        const bookContent = document.getElementById('book-content');
        if (bookContent) {
            const urlParams = new URLSearchParams(window.location.search);
            const bookId = urlParams.get('id');
            if (bookId) {
                fetchBook(bookId);
            }
        }
    }
});

function loadBooks() {
    fetch('books.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Books data loaded:', data); // 디버깅 로그
            booksData = data.books;
            const bookList = document.getElementById('book-list');
            booksData.forEach(book => {
                const bookElement = createBookElement(book);
                bookList.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error loading books:', error);
            document.getElementById('book-list').innerHTML = '<p>책 목록을 불러오는 데 실패했습니다.</p>';
        });
}

function createBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';
    bookItem.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image">
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">저자: ${book.author}</p>
            <span class="book-genre">${book.genre}</span>
        </div>
    `;
    bookItem.addEventListener('click', () => {
        window.location.href = `book.html?id=${book.id}`;
    });
    return bookItem;
}

function fetchBook(bookId) {
    if (!booksData.length) {
        // books.json을 아직 로드하지 않았다면 로드합니다.
        return fetch('books.json')
            .then(response => response.json())
            .then(data => {
                booksData = data.books;
                return fetchBookContent(bookId);
            });
    } else {
        return fetchBookContent(bookId);
    }
}

function fetchBookContent(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (book) {
        return fetch(book.link)
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById('book-content').innerHTML = html;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('book-content').innerHTML = '<p>책 내용을 불러오는 데 실패했습니다.</p>';
            });
    } else {
        document.getElementById('book-content').innerHTML = '<p>해당 책을 찾을 수 없습니다.</p>';
        return Promise.resolve();
    }
}