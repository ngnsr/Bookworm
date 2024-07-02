const apiUrl = "http://localhost:3333/api/";

async function searchAuthors() {
    const searchInput = document.getElementById("searchInput").value;
    try {
        const response = await fetch(apiUrl + `author/find-by-name?name=${searchInput}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const authors = await response.json();
        displayAuthors(authors);
    } catch (error) {
        console.error("Error searching authors:", error);
    }
}

function displayAuthors(authors) {
    const authorsList = document.getElementById("authorsList");
    authorsList.innerHTML = "";
    authors.forEach(author => {
        console.log(author);
        const authorElement = document.createElement("div");
        authorElement.classList.add('col-md-4', 'mb-5');
        authorElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">${author.first_name.concat(' ', author.last_name)}</h6>
                            <a href="/authorInfo.html?id=${author.id}" class="btn btn-primary">Докладніше</a>
                        </div>
                    </div>
                `;
        authorsList.appendChild(authorElement);
    });
}

async function fetchAuthors() {
    try {
        const response = await fetch(apiUrl + 'author');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const authors = await response.json();
        await displayAuthors(authors);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

async function update(){
    await fetchAuthors();
    toggle();
}

window.onload = update;
