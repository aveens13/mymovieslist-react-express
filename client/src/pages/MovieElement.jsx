export default function MovieElement(props) {
  return (
    <>
      <div className="movie-card" key={props.movieData.id}>
        <img
          src={props.getPosterUrl}
          alt="movie poster"
          className="movie-poster"
        />
        <div className="movie-info">
          <div className="rating">
            <a href="#">
              <i className="fas fa-star"></i>
            </a>
            <strong>{props.movieData.vote_average}</strong>
          </div>

          <h1 className="movie-title">{props.movieData.title}</h1>

          <button
            className={props.buttonColor ? "btn-watch primary" : "btn-watch"}
            value={props.movieData.id}
            onClick={props.handleWatchedMovie}
          >
            <a href="#">
              <i className="fas fa-plus"></i>
            </a>
            Add to list
          </button>
        </div>
      </div>
    </>
  );
}
