const apiUrl = "http://localhost:3333/api/";

async function addBook() {
    const title = document.getElementById("bookTitle").value;
    const author_id = document.getElementById("bookAuthor").value;
    const genresSelect = document.getElementById("bookGenre");
    const selectedGenres = Array.from(genresSelect.selectedOptions).map(option => option.value);
    const description = document.getElementById("bookDescription").value;
    const year = document.getElementById("bookYear").value;

    if (!title || !author_id || !selectedGenres.length || !description || !year) {
        alert("Будь ласка, заповніть всі обов'язкові поля.");
        return;
    }

    // if(!Number.isInteger(year)){
    //     alert("Рік має бути цілим числом");
    //     return;
    // }

    const data = {
        title: title,
        author_id: author_id,
        genre_ids: selectedGenres,
        description: description,
        year: year
    };

    try {
        const response = await fetch(apiUrl + "book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.log(await response.json());
            throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        showBookSuccessToast();
        setTimeout(clearBookForm, 1500);
        console.log("Book added successfully:", responseData);
    } catch (error) {
        console.error("Error adding book:", error);
    }
}

async function addAuthor() {
    const name = document.getElementById("authorName").value;
    const surname = document.getElementById("authorSurname").value;
    const bio = document.getElementById("authorBio").value;

    if (!name || !surname || !bio) {
        alert("Будь ласка, заповніть всі обов'язкові поля.");
        return;
    }

    const data = {
        firstName: name,
        lastName: surname,
        biography: bio
    };

    try {
        const response = await fetch(apiUrl + "author", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        showAuthorSuccessToast();
        setTimeout(clearAuthorForm, 1500);
        console.log("Author added successfully:", responseData);
    } catch (error) {
        const responseData = await response.json();
        console.log(responseData);
        console.error("Error adding author:", error);
    }
}

async function addGenre() {
    const name = document.getElementById("genreName").value;

    if(!name){
        alert("Будь ласка, заповніть всі поля!");
        return;
    }

    const data = {
        name: name
    };

    try {
        const response = await fetch(apiUrl + "genre", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        showGenreSuccessToast();
        setTimeout(clearGenreForm, 3000);
        console.log("Genre added successfully:", responseData);
    } catch (error) {
        console.error("Error adding genre:", error);
    }
}

function clearBookForm() {
    document.getElementById("bookTitle").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookGenre").value = "";
    document.getElementById("bookDescription").value = "";
}

function clearAuthorForm() {
    document.getElementById("authorName").value = "";
    document.getElementById("authorBio").value = "";
}

function clearGenreForm() {
    document.getElementById("genreName").value = "";
}

function showBookSuccessToast() {
    const toast = new bootstrap.Toast(document.getElementById('bookSuccessToast'), {delay: 3000});
    toast.show();
}

function showAuthorSuccessToast() {
    const toast = new bootstrap.Toast(document.getElementById('authorSuccessToast'), {delay: 3000});
    toast.show();
}

function showGenreSuccessToast() {
    const toast = new bootstrap.Toast(document.getElementById('genreSuccessToast'), {delay: 3000});
    toast.show();
}

let author_choices;
let genres_choices;

async function update() {
    const e1 = document.getElementById('bookAuthor');
    const e2 = document.getElementById('bookGenre');

    if (e1) {
        author_choices = new Choices(e1, {
            searchEnabled: true,
            searchPlaceholderValue: 'Автор...',
            itemSelectText: 'Натисніть щоб вибрати'
        });
    }
    if (e2){
        genres_choices = new Choices(e2, {
            removeItemButton: true,
            placeholder: true,
            placeholderValue: 'Виберіть жанр',
            searchEnabled: true,
            maxItemCount: 10,
            position: 'bottom'
        });
    }
    await updateAuthorSelectOptions();
    await updateGenreSelectOptions();
    toggle();
}

async function updateAuthorSelectOptions() {
    author_choices.clearChoices();

    const authors = await fetchAuthors();

    const options = authors
        .map(author => ({
            value: author.id,
            label: author.first_name + " " + author.last_name
        }));

    if (options.length > 0) {
        author_choices.setChoices(options, 'value', 'label', true);
        const first_option = options[0];
        author_choices.setChoiceByValue(first_option.value);
    } else {
        author_choices.setValue([""]);
    }
}

async function updateGenreSelectOptions() {
    const genres = await fetchGenres();
    const options = genres.map(genre => ({
        value: genre.id,
        label: genre.name
    }))

    if(options.length > 0){
        genres_choices.setChoices(options, 'value', 'label', true);
        // const first_option = options[0];
        // genres_choices.setChoiceByValue(first_option.value);
    }else{
        genres_choices.setValue([""]);
    }
}


async function fetchAuthors(){
    try {
        const response = await fetch(apiUrl + '/author');
        return await response.json();
    } catch (error) {
        console.error('Помилка при отриманні списку авторів:', error);
        alert('Помилка при отриманні списку авторів');
    }
}

async function fetchGenres() {
    try {
        const response = await fetch(apiUrl + '/genre');
        return await response.json();
    } catch (error) {
        console.error('Помилка отримання жанрів:', error);
        alert('Помилка при отриманні списку жанрів');
    }
}

window.onload = update;