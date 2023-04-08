import { useRef, useState, useEffect } from "react";

export default function Shows() {
  const [tvShow, setTvShow] = useState([]);

  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };
  //Setting up the useeffect for tv shows
  useEffect(() => {
    fetch("/api/tv-shows").then((response) => {
      response.json().then((data) => {
        setTvShow(data.result);
      });
    });
  }, []);
  return (
    <>
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
                  <button className="btn-watch" value={showData.id}>
                    <a href="#">
                      <i className="fas fa-plus"></i>
                    </a>
                    Add to list
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
