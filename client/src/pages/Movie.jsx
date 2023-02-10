import { useState, useEffect } from "react";
let responseValue;
export default function Movie() {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    fetch("/api/movies").then((response) => {
      response.json().then((data) => {
        setMovie(data.d);
      });
    });
  });
  return (
    <>
      <div className="movies">
        <ul>
          {movie.map((movieData) => (
            <li key={movieData.id}>{movieData.l}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
