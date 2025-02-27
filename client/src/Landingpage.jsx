import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Landingpage.css";

export default function Landingpage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  // const [slicelength, setSlicelength] = useState(8);
  const [featuredContent, setFeaturedContent] = useState({});

  //Get the image for the movie poster
  const getPosterUrl = (posterId) => {
    return `https://image.tmdb.org/t/p/original${posterId}`;
  };

  //Setting up the useeffect for movies
  useEffect(() => {
    fetch("/api/movies/homepage").then((response) => {
      response.json().then((data) => {
        setMovies(data.result.popular);
        setFeaturedContent(data.result.popular[0]);
        console.log(data.result.popular);
      });
    });
  }, []);

  const updateFeaturedContent = (item) => {
    setFeaturedContent(item);
  };

  const handlePlayClick = () => {
    localStorage.setItem(
      "redirectAfterLogin",
      `/details/${featuredContent.id}/movie`
    );
    navigate("/login");
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo-container">
            <div className="logo-diamond"></div>
            <h1 className="logo">MovieRidge</h1>
          </div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">TV Shows</Link>
            </li>
            <li>
              <Link to="/login">Movies</Link>
            </li>
            <li>
              <Link to="/series">Series</Link>
            </li>
            <li>
              <Link to="/upcoming">Upcoming</Link>
            </li>
          </ul>
        </div>
        <div className="nav-right">
          <Link to="/signup" className="signup-btn">
            Sign Up
          </Link>
          <Link to="/login" className="login-btn">
            Sign In
          </Link>
        </div>
      </nav>

      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${getPosterUrl(
            featuredContent.backdrop_path
          )})`,
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="feature-details">
              <div className="feature-logo">
                <h1>{featuredContent?.title}</h1>
              </div>
              <div className="feature-meta">
                <div className="meta-stats">
                  <span className="like-percentage">
                    <i className="thumbs-up-icon">👍</i>{" "}
                    {featuredContent?.vote_average} Votes
                  </span>
                  <span className="year">{featuredContent?.release_date}</span>
                  <span className="rating">
                    {featuredContent?.adult ? "18+" : "14+"}
                  </span>
                  <span className="genre">{featuredContent?.genre}</span>
                </div>
                <p className="description">{featuredContent?.overview}</p>

                <div className="cast-section">
                  <h3>STARRING :</h3>
                  <div className="cast-avatars">
                    {featuredContent?.cast?.slice(0, 8).map((actor) => (
                      <div key={actor.id} className="cast-avatar">
                        <img
                          src={getPosterUrl(actor.profile_path)}
                          alt={actor.name}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="play-btn" onClick={handlePlayClick}>
                    <span className="play-icon">▶</span> Play Now
                  </button>
                  <button className="wishlist-btn">
                    <span className="plus-icon">+</span> My Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="carousel-section">
        <div className="carousel-container">
          {movies.map((item) => (
            <div
              key={item.id}
              className="carousel-item"
              onClick={() => updateFeaturedContent(item)}
            >
              <img src={getPosterUrl(item.backdrop_path)} alt={item.title} />
              <div className="carousel-item-overlay">
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
