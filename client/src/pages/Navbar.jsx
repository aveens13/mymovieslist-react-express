import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
export default function NavBar(props) {
  let navigate = useNavigate();
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
