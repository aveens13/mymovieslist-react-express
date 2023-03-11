import "../styles/list.css";
import { useEffect, useState } from "react";
import movieImage from "../assets/OIP.jpg";
export default function List() {
  const [list, setList] = useState([]);
  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };
  useEffect(() => {
    fetch("/api/get-movie-list").then((response) => {
      response.json().then((data) => {
        setList(data.result);
      });
    });
  }, []);
  return (
    <div className="listSection">
      <h1>Movie List</h1>
      {list.map((movie) => (
        <div className="card--main">
          <div className="card--hero">
            <div className="img">
              <img src={getPosterUrl(movie.poster_path)} alt="Movie" />
            </div>
            <div className="content">
              <h2>{movie.original_title}</h2>
              <p>{movie.overview}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
