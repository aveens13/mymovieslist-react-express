import { Link } from "react-router-dom";
import { useState } from "react";
export default function Moviecard(props) {
  const [type, setType] = useState(props.movieData.title ? "movie" : "tv");
  return (
    <>
      <section id="movie-main-slider">
        <div className="slider-movie-wrapper">
          <div className="movie-poster-details">
            <Link to={`/details/${props.movieData.id}/${type}`}>
              <img src={props.getPosterUrl} alt="movie poster" />
            </Link>
            <h1>{props.movieData.title}</h1>
            <p>{props.movieData.overview}</p>
          </div>
        </div>
      </section>
    </>
  );
}
