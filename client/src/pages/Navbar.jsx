import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useRef } from "react";
import SearchResults from "./SearchResults";

export default function NavBar(props) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const overlayRef = useRef(null);
  let navigate = useNavigate();

  function handleChange(event) {
    setQuery(event.target.value);
    setShowResults(true);
    // const response = await fetch(`/api/search?name=${movieName}`, {
    //   method: "POST",
    // });
    // if (response.ok) {
    //   response.json().then((e) => {
    //     setSearchData(e.result);
    //   });
    // }
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

  return (
    <header className="navBar">
      <h1 className="title">
        <Link to="/">Movies Ridge</Link>
      </h1>
      <form>
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
            <SearchResults query={query} />
          </div>
        </div>
      )}
      <nav>
        <ul className="navItems">
          <li className="listItem">
            <Link to="/list">My List</Link>
          </li>
          <li className="listItem">
            <Link to="/movies">Movies</Link>
          </li>
          <li className="listItem">
            <Link to="/tv-shows">TV Shows</Link>
          </li>
          <li className="userImage" onClick={handleLogout}>
            <LogoutIcon fontSize="large" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
