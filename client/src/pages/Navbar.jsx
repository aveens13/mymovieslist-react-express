import "../styles/Navbar.css";
import MovieIcon from "@mui/icons-material/Movie";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect, useRef } from "react";
import SearchResults from "./SearchResults";
import { Input } from "antd";
const { Search } = Input;
export default function NavBar(props) {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const overlayRef = useRef(null);
  let navigate = useNavigate();

  function handleChange(event) {
    setQuery(event.target.value);
    setShowResults(true);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [overlayRef]);

  function handleLogout() {
    fetch("/api/logout").then((response) => {
      if (response.ok) {
        props.changeState();
        navigate("/");
      }
    });
  }

  function toggleButton() {
    setIsActive(!isActive);
  }

  return (
    <>
      <header className="navBar">
        <div className="mainLogo">
          <Link to="/">
            <div className="title">
              <MovieIcon color="white" style={{ fontSize: 60 }} />
              <div className="fonty">
                <div>Movie</div>
                <div>Ridge</div>
              </div>
            </div>
          </Link>
        </div>
        <form onSubmit={(event) => event.preventDefault()}>
          <SearchIcon className="searchIcon" />

          <input
            type="search"
            name="searchItem"
            id="searchItem"
            onChange={handleChange}
            placeholder="Search Movies/Tv-Shows"
          />
        </form>
        {showResults && (
          <div className="search-overlay">
            <div className="search-results-container" ref={overlayRef}>
              <SearchResults
                query={query}
                queryClick={() => setShowResults(false)}
              />
            </div>
          </div>
        )}
        <nav>
          <ul className="navItems">
            <li className="listItem">
              <Link to="/list">List</Link>
            </li>
            <li className="listItem">
              <Link to="/movies">Movies</Link>
            </li>
            <li className="listItem">
              <Link to="/tv-shows">Shows</Link>
            </li>
            <li className="listItem">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="userImage" onClick={handleLogout}>
              <LogoutIcon fontSize="large" />
            </li>
          </ul>
        </nav>
        <div className="toggle-btn">
          <MenuIcon fontSize="medium" onClick={toggleButton} />
        </div>
      </header>
      <div className={isActive ? "dropdown_menu_active" : "dropdown_menu"}>
        <ul>
          <li className="listItem">
            <Link to="/list">List</Link>
          </li>
          <li className="listItem">
            <Link to="/movies">Movies</Link>
          </li>
          <li className="listItem">
            <Link to="/tv-shows">Shows</Link>
          </li>
          <li className="listItem">
            <Link to="/profile">Profile</Link>
          </li>
          <li className="userImage" onClick={handleLogout}>
            <LogoutIcon fontSize="large" />
          </li>
        </ul>
      </div>
    </>
  );
}
