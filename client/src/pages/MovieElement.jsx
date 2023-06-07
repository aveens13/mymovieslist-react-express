import { Button, Space } from "antd";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
export default function MovieElement(props) {
  const [loading, setLoading] = useState(false);
  function handleClick() {
    setLoading(true);
    props.handleWatchedMovie(props.movieData.id).then(() => setLoading(false));
  }
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
              <StarIcon className="i" />
            </a>
            <strong>{props.movieData.vote_average}</strong>
          </div>

          <h1 className="movie-title">{props.movieData.title}</h1>

          <Button
            type="primary"
            loading={loading}
            className="btn-watch"
            value={props.movieData.id}
            onClick={handleClick}
          >
            Add to list
          </Button>
        </div>
      </div>
    </>
  );
}
