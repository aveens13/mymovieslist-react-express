import { useRef, useState, useEffect } from "react";
import "../styles/Movie.css";
import MovieElement from "./MovieElement";
export default function Movie({ userToken }) {
  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };
  const [movie, setMovie] = useState([]);
  const [buttonColor, setButtonColor] = useState(false);
  //Setting up the useeffect for movies
  useEffect(() => {
    fetch("/api/movies").then((response) => {
      response.json().then((data) => {
        setMovie(data.result);
      });
    });
  }, []);

  function handleWatchedMovie(event) {
    console.log(event.target.value);
    setButtonColor(true);
    fetch(`/api/add-movie/${event.target.value}/${userToken.id}`, {
      method: "POST",
    }).then((response) => {});
  }
  return (
    <>
      <section id="slider-container">
        <h1 className="main-header">Popular Movies Right Now</h1>
        <div className="movie-slider">
          <div className="movie-list">
            {movie.map((movieData) => (
              <MovieElement
                movieData={movieData}
                getPosterUrl={getPosterUrl(movieData.poster_path)}
                handleWatchedMovie={handleWatchedMovie}
                buttonColor={buttonColor}
                key={movieData.id}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
