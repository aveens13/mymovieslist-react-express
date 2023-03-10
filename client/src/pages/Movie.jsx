import { useRef, useState, useEffect } from "react";
import "../styles/Movie.css";
export default function Movie() {
  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };
  const [movie, setMovie] = useState([]);
  useEffect(() => {
    fetch("/api/movies").then((response) => {
      response.json().then((data) => {
        setMovie(data.result);
      });
    });
  }, []);

  function handleWatched(event){
    fetch(`/api/add-movie/${event.target.value}`, {
      method: "POST",
    }).then(response=>{
      
    })
  }
  return (
    <>
      <section id="slider-container">
        <h1 className="main-header">Popular Right Now</h1>
        <div className="movie-slider">
          <div className="movie-list">
            {movie.map((movieData) => (
              <div className="movie-card" key={movieData.id}>
                <img
                  src={getPosterUrl(movieData.poster_path)}
                  alt="movie poster"
                  className="movie-poster"
                />
                <div className="movie-info">
                  <div className="rating">
                    <a href="#">
                      <i className="fas fa-star"></i>
                    </a>
                    <strong>{movieData.vote_average}</strong>
                  </div>

                  <h1 className="movie-title">{movieData.title}</h1>
                  <button className="btn-watch" value={movieData.id} onClick={handleWatched}>
                    <a href="#">
                      <i className="fas fa-plus"></i>
                    </a>
                    Watched
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
