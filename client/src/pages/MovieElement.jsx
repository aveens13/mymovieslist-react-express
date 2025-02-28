import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Link } from "react-router-dom";

export default function MovieElement({
  movieData,
  getPosterUrl,
  handleWatchedMovie,
}) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const type = movieData.title ? "movie" : "tv";

  function handleSave() {
    setLoading(true);
    handleWatchedMovie(movieData.id).then(() => {
      setLoading(false);
      setSaved(true);
    });
  }

  return (
    <div
      className="movie-card"
      key={movieData.id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="poster-container">
        <Link to={`/details/${movieData.id}/${type}`}>
          <img
            src={getPosterUrl}
            alt={movieData.title || movieData.name}
            className="movie-poster"
          />
          {hovered && (
            <div className="hover-overlay">
              <div className="play-button">
                <PlayArrowIcon />
                <span>Watch Now</span>
              </div>
            </div>
          )}
        </Link>
        <div className="rating-badge">
          <StarIcon className="star-icon" />
          <span>{movieData.vote_average.toFixed(1)}</span>
        </div>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movieData.title || movieData.name}</h3>
        <div className="movie-meta">
          {movieData.release_date && (
            <span className="release-year">
              {new Date(movieData.release_date).getFullYear()}
            </span>
          )}
          {movieData.first_air_date && (
            <span className="release-year">
              {new Date(movieData.first_air_date).getFullYear()}
            </span>
          )}
        </div>
        <button
          className={`bookmark-button ${saved ? "saved" : ""}`}
          onClick={handleSave}
          disabled={loading}
        >
          {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          <span>{saved ? "Added" : "Add to list"}</span>
        </button>
      </div>
    </div>
  );
}
