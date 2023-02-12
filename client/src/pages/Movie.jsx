import { useState, useEffect } from "react";
import "../styles/Movie.css";
export default function Movie() {
  const [movie, setMovie] = useState([]);
  // const getMovies = async () => {
  //   const response = await fetch("/api/movies");
  //   const movies = await response.json();
  //   setMovie(movies.d);
  // };

  // useEffect(() => {
  //   getMovies();
  // }, []);
  useEffect(() => {
    fetch("/api/movies").then((response) => {
      response.json().then((data) => {
        setMovie(data.d);
      });
    });
  }, []);
  return (
    <>
      <div className="movies">
        <ul>
          {movie.map((movieData) => (
            <div>
              <li key={movieData.id}>{movieData.l}</li>
              <img src={movieData.i.imageUrl} />
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}
