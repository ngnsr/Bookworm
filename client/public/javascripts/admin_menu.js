function ChangeContent(divName) {
    const allDivs = ["BookDiv", "AuthorDiv", "GenreDiv"];

    allDivs.forEach(function (divId) {
        const currentDiv = document.getElementById(divId);
        currentDiv.style.display = (divId === divName) ? "block" : "none";
    });
}