const apiKey = CONFIG.OMDB_API_KEY;
const movieDetailsDiv = document.getElementById("movieDetails");
const ratingStars = document.getElementById("ratingStars");
const reviewText = document.getElementById("reviewText");
const submitReview = document.getElementById("submitReview");
const reviewsContainer = document.getElementById("reviewsContainer");

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

let selectedRating = 0;

fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => displayMovieDetails(data))
    .catch(err => console.error(err));
    
function displayMovieDetails(movie){
    movieDetailsDiv.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'assets/images/placeholder.png'}" alt="${movie.Title}">
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
    `;
    createStarRating();
    loadReviews();
}
function createStarRating(){
    ratingStars.innerHTML = "";
    for(let i=1; i<=5; i++){
        const star = document.createElement("span");
        star.innerHTML = "★";
        star.style.color = "lightgray";
        star.addEventListener("mouseenter", () => highlightStars(i));
        star.addEventListener("mouseleave", () => highlightStars(selectedRating));
        star.addEventListener("click", () => selectedRating = i);
        ratingStars.appendChild(star);
    }
}

function highlightStars(rating){
    const stars = ratingStars.querySelectorAll("span");
    stars.forEach((star, idx) => {
        star.style.color = idx < rating ? "gold" : "lightgray";
    });
}

submitReview.addEventListener("click", () => {
    if(selectedRating === 0 || reviewText.value.trim() === "") return alert("Please provide rating and review!");
    const reviewObj = {
        rating: selectedRating,
        text: reviewText.value.trim(),
        date: new Date().toLocaleString()
    };
    saveReview(movieId, reviewObj);
    reviewText.value = "";
    selectedRating = 0;
    createStarRating();
    loadReviews();
});

function loadReviews(){
    const reviews = getReviews(movieId);
    reviewsContainer.innerHTML = "";
    if(reviews.length === 0) reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    reviews.forEach(r => {
        const div = document.createElement("div");
        div.classList.add("review");
        div.innerHTML = `<strong>Rating:</strong> ${r.rating} ★ <br>${r.text} <br><small>${r.date}</small>`;
        reviewsContainer.appendChild(div);
    });
}
