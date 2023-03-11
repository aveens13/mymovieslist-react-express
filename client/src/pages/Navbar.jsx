import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useState, setState } from "react";
export default function NavBar() {
  const [fix, setFix] = useState(false);
  const setFixed = () => {
    if (window.scrollY > 0) {
      setFix(true);
    } else {
      setFix(false);
    }
  };
  window.addEventListener("scroll", setFixed);
  return (
    <header className={fix ? "navBar scrolled" : "navBar"}>
      <h1 className="title">
        <Link to="/">Movies Ridge</Link>
      </h1>
      {/* <form className="search">
        <input type="text" placeholder="Search..." />
        <button type="submit">
          <span className="material-symbols-outlined">search</span>
        </button>
      </form> */}
      <nav>
        <ul className="navItems">
          <li className="listItem">
            <Link to="/list">My List</Link>
          </li>
          <li className="listItem">
            <Link to="/movies">Movies</Link>
          </li>
          <li className="listItem">TV Shows</li>
        </ul>
      </nav>
    </header>
  );
}
