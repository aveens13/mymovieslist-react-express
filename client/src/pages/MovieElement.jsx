import { Button, Space } from "antd";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
export default function MovieElement(props) {
  const [loading, setLoading] = useState(false);
  function handleClick() {
    setLoading(true);
    props.handleWatchedMovie(props.movieData.id).then(() => setLoading(false));
  }
  const [type, setType] = useState(props.movieData.title ? "movie" : "tv");
  console.log(type);
  return (
    <>
      <div className="movie-card" key={props.movieData.id}>
        <Link to={`/details/${props.movieData.id}/${type}`}>
          <img
            src={props.getPosterUrl}
            alt="movie poster"
            className="movie-poster"
          />
        </Link>
        <div className="movie-info">
          <div className="rating">
            <a href="#">
              <StarIcon className="i" />
            </a>
            <strong>{props.movieData.vote_average}</strong>
          </div>
          {props.movieData.title ? (
            <h1 className="movie-title">{props.movieData.title}</h1>
          ) : (
            <h1 className="movie-title">{props.movieData.name}</h1>
          )}

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
