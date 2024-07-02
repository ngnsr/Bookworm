const apiUrl = "http://localhost:3333/api/";

async function fetchBooks() {
    try {
        const response = await fetch(apiUrl + 'book/all-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const books = await response.json();
        await displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

async function displayBooks(books) {
    const booksContainer = document.getElementById('booksContainer');
    booksContainer.innerHTML = '';

    books.forEach(book => {
        console.log(book);
        const bookElement = document.createElement('div');
        bookElement.classList.add('col-md-4', 'mb-4');
        bookElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Автор: ${book.Author.first_name.concat(' ', book.Author.last_name)}</h6>
                            <h6 class="card-text">Рік: ${book.year}</h6>
                            <h6 class="card-text">Жанри: ${book.Genres.map(genre => genre.name).join(', ')}</h6>
                            <h6 class="card-text">Рейтинг: ${book.rating ? book.rating : 0}</h6>
                            <a href="/bookInfo.html?id=${book.id}" class="btn btn-primary">Докладніше</a>
                            <button class="btn wishlist-butto" data-book-id="${book.id}">
                                <svg width="32" height="32" class="wishlist-icon">
                                    <image href="images/wishlist.png"></image>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
        booksContainer.appendChild(bookElement);
    });
}

async function loadGenresForFilter() {
    try {
        const response = await fetch(apiUrl + 'genre');
        const genres = await response.json();

        const genreFilter = document.getElementById('genreFilter');

        genres.forEach(genre => {
            const genreOption = document.createElement('div');
            genreOption.classList.add('form-check');
            genreOption.innerHTML = `
                <input class="form-check-input" type="checkbox" name="genreCheckbox" id="genre${genre.id}" value="${genre.id}">
                <label class="form-check-label" for="genre${genre.id}">
                    ${genre.name}
                </label>
            `;
            genreFilter.appendChild(genreOption);
        });
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

async function filterBooksByGenre() {
    const selectedGenres = Array.from(document.querySelectorAll('input[name="genreCheckbox"]:checked')).map(checkbox => checkbox.value);
    try {
        const data = {
            genre_ids: selectedGenres
        };
        const response = await fetch(apiUrl + 'book/get-by-ganres', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const books = await response.json();
        console.log(books);

        await displayBooks(books);
    } catch (error) {
        console.error('Error filtering books:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadGenresForFilter();
    await fetchBooks();
    toggle();


    document.getElementById('genreFilter').addEventListener('change', filterBooksByGenre);
});