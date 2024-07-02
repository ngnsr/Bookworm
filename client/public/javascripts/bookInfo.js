const apiUrl = "http://localhost:3333/api/";

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(apiUrl + `book/details-by-id/${bookId}`);
        if (!response.ok) {
            throw new Error('Помилка запиту до сервера');
        }
        return await response.json();
    } catch (error) {
        console.error('Помилка отримання детальної інформації про книгу:', error);
        return null;
    }
}

async function fillBookDetails() {
    const book = await fetchBookDetails(bookId);
    if (book) {
        document.getElementById('bookTitle').textContent = book.title;
        document.getElementById('bookAuthor').textContent = book.Author.firstName.concat(' ', book.Author.lastName);
        document.getElementById('bookGenres').textContent = book.Genres.map(genre => genre.name).join(', ');
        document.getElementById('bookYear').textContent = book.year;
        document.getElementById('bookDescription').textContent = book.description;
        document.getElementById('bookRating').textContent = book.rating;
    } else {
        console.error('Книга з вказаним id не знайдена');
    }
}

async function fetchBookReviews(bookId) {
    try {
        const response = await fetch(apiUrl + `book/${bookId}/reviews`);
        if (!response.ok) {
            throw new Error('Помилка запиту до сервера');
        }
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Помилка отримання відгуків про книгу:', error);
        return [];
    }
}

function createReviewElement(review) {
    const li = document.createElement('li');
    li.className = 'list-group-item';

    const email = document.createElement('h4');
    email.className = 'review-email';
    email.textContent = review.User.email; // Припускаємо, що у вашій моделі User є поле email

    const text = document.createElement('h5');
    text.className = 'review-text';
    text.textContent = review.text;

    const rating = document.createElement('h5');
    rating.className = 'review-rating';
    rating.textContent = `Оцінка: ${review.rating}`;

    const br = document.createElement('br');

    li.appendChild(email);
    li.appendChild(text);
    li.appendChild(rating);
    li.appendChild(br);

    return li;
}



async function renderBookReviews() {
    try {
        const response = await fetch(apiUrl + `/book/${bookId}/reviews`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reviews = await response.json();
        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = '';

        reviews.forEach(review => {
            const reviewElement = createReviewElement(review);
            reviewsList.appendChild(reviewElement);
        });
    } catch (error) {
        console.error('Error loading reviews:', error);
    }}

async function update(){
    await fillBookDetails();
    await renderBookReviews();
    toggle();
}

async function addReview() {
    const reviewText = document.getElementById('reviewText').value;
    const reviewRating = document.getElementById('reviewRating').value;

    const reviewData = {
        book_id: bookId,
        text: reviewText,
        rating: reviewRating
    };

    try {
        const response = await fetch(apiUrl + 'review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        if (response.ok) {
            await renderBookReviews();
        } else {
            console.log(await response.json());
            console.error('Failed to submit review:', await response.json());
        }
    } catch (error) {
        console.error('Error submitting review:', error);
    }
}


window.onload = update;