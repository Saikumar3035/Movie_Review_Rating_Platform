function saveReview(movieId, reviewObj) {
    let reviews = JSON.parse(localStorage.getItem(movieId)) || [];
    reviews.push(reviewObj);
    localStorage.setItem(movieId, JSON.stringify(reviews));
}

function getReviews(movieId) {
    return JSON.parse(localStorage.getItem(movieId)) || [];
}
