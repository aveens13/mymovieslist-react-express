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
  return (
    <>
      <section id="slider-container">
        <h1 className="main-header">Popular Right Now</h1>
        <div className="movie-slider">
          <div className="movie-list">
            {movie.map((movieData) => (
              <div className="movie-card">
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
                  <button className="btn-watch">
                    <a href="#">
                      <i className="fas fa-plus"></i>
                    </a>
                    Watched
                  </button>
                </div>
              </div>
              /* <div className="slider-box">
                <div className="slider-image">
                  <img src={getPosterUrl(movieData.poster_path)} />
                </div>
                <div className="slider-details">
                  <strong>{movieData.title}</strong>
                  <div className="rating">
                    <a href="#">
                      <i className="fas fa-star"></i>
                    </a>
                    <strong>{movieData.vote_average}</strong>
                  </div>
                  <p>{movieData.overview}</p>
                  <div className="release-data">
                    <strong>{movieData.release_date}</strong>
                  </div>
                  <div className="card-btns">
                    <a href="#" className="mylist-btn">
                      Watched
                    </a>
                  </div>
                </div>
              </div> */
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
