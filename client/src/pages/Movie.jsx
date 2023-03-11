import { useRef, useState, useEffect } from "react";
import "../styles/Movie.css";
export default function Movie() {
  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };
  const [movie, setMovie] = useState([]);
  const [tvShow, setTvShow] = useState([]);

  //Setting up the useeffect for movies
  useEffect(() => {
    fetch("/api/movies").then((response) => {
      response.json().then((data) => {
        setMovie(data.result);
      });
    });
  }, []);

  //Setting up the useeffect for tv shows
  useEffect(() => {
    fetch("/api/tv-shows").then((response) => {
      response.json().then((data) => {
        setTvShow(data.result);
      });
    });
  }, []);

  function handleWatchedMovie(event){
    fetch(`/api/add-movie/${event.target.value}`, {
      method: "POST",
    }).then(response=>{
      
    })
  }
  return (
    <>
      <section id="slider-container">
        <h1 className="main-header">Popular Movies Right Now</h1>
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
                  <button className="btn-watch" value={movieData.id} onClick={handleWatchedMovie}>
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
      <section id="tv slider-container">
        <h1 className="main-header">Popular Tv Shows Right Now</h1>
        <div className="movie-slider">
          <div className="movie-list">
            {tvShow.map((showData) => (
              <div className="movie-card" key={showData.id}>
                <img
                  src={getPosterUrl(showData.poster_path)}
                  alt="movie poster"
                  className="movie-poster"
                />
                <div className="movie-info">
                  <div className="rating">
                    <a href="#">
                      <i className="fas fa-star"></i>
                    </a>
                    <strong>{showData.vote_average}</strong>
                  </div>

                  <h1 className="movie-title">{showData.original_name}</h1>
                  <button className="btn-watch" value={showData.id} >
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
