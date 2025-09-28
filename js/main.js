const apiKey = CONFIG.OMDB_API_KEY;
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("moviesContainer");
const sortSelect = document.getElementById("sortSelect");

const defaultMovies = ["Avengers", "Inception", "Titanic", "Interstellar", "Joker"];

function loadTrending() {
    defaultMovies.forEach(title => fetchMovies(title));
}
loadTrending();

function fetchMovies(query) {
    fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if(data.Search){
                displayMovies(data.Search);
            }
        }).catch(err => console.error(err));
}
function displayMovies(movies) {
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.dataset.year = movie.Year;
        card.dataset.rating = movie.imdbRating || 0;
        card.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'assets/images/placeholder.png'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;
        card.addEventListener("click", () => {
            window.location.href = `movie.html?id=${movie.imdbID}`;
        });
        moviesContainer.appendChild(card);
    });
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if(query.length > 2){
        moviesContainer.innerHTML = "";
        fetchMovies(query);
    }
});

sortSelect.addEventListener("change", () => {
    const option = sortSelect.value;
    let movies = Array.from(document.querySelectorAll(".movie-card"));
    if(option === "rating") {
        movies.sort((a,b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
    } else if(option === "year") {
        movies.sort((a,b) => parseInt(b.dataset.year) - parseInt(a.dataset.year));
    }
    moviesContainer.innerHTML = "";
    movies.forEach(m => moviesContainer.appendChild(m));
});
