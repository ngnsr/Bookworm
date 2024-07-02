const apiUrl = "http://localhost:3333/api/";

const urlParams = new URLSearchParams(window.location.search);
const authorId = urlParams.get('id');

async function displayAuthorDetails(authorId) {
    try {
        const response = await fetch(apiUrl + `/author/${authorId}/details`);
        if (!response.ok) {
            throw new Error('Помилка отримання інформації про автора');
        }
        const author = await response.json();
        console.log(author);

        document.getElementById('authorFirstName').textContent = author.first_name;
        document.getElementById('authorLastName').textContent = author.last_name;
        document.getElementById('authorBio').textContent = author.biography;

        const booksList = document.getElementById('authorBooks');
        booksList.innerHTML = '';
        author.Books.forEach(book => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = book.title;
            link.href = `/bookInfo.html?id=${book.id}`;
            li.appendChild(link);
            booksList.appendChild(li);
        });
        const genresResponse = await fetch(apiUrl + `/author/get-genres/${authorId}`)
        const genres = await genresResponse.json();
        const genresList = document.getElementById('authorGenres')
        genresList.innerHTML = '';
        genres.forEach(genre => {
            const li = document.createElement('li');
            li.textContent = genre.name;
            genresList.appendChild(li);
        });
    } catch (error) {
        console.error('Помилка відображення інформації про автора:', error);
    }
}

async function update(){
    await displayAuthorDetails(authorId);
    toggle();
}

window.onload = update;
