import "../styles/Navbar.css";
import MovieIcon from "@mui/icons-material/Movie";
import movie from "../assets/movieridge_no_image.png";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect, useRef, useCallback } from "react";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Input, Dropdown, Popconfirm, AutoComplete } from "antd";

export default function NavBar(props) {
  const [isActive, setIsActive] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef(null);
  const items = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <span onClick={() => navigate(`/profile?id=${props.userToken.id}`)}>
          Profile
        </span>
      ),
      extra: "⌘P",
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: <span onClick={handleLogout}>Logout</span>,
      extra: "⌘B",
      icon: <LogoutOutlined />,
    },
    {
      key: "4",
      label: "Settings",
      icon: <SettingOutlined />,
      extra: "⌘S",
    },
  ];

  let navigate = useNavigate();

  const getPosterUrl = (posterId) => {
    if (posterId == null) {
      return movie;
    }
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };

  //Fetch search results
  const fetchResults = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setOptions([]);
      return;
    }
    setShowResults(true);
    try {
      const response = await fetch(`/api/search?name=${searchQuery}`, {
        method: "POST",
      });
      if (response.ok) {
        response.json().then((e) => {
          console.log(e.result);
          //Change options here
          setOptions(
            e.result.map((item) => {
              const title =
                item.media_type === "movie"
                  ? `${item.title} (${item.release_date})`
                  : item.media_type === "tv"
                  ? `${item.name} (${item.first_air_date})`
                  : `${item.name} (${item.known_for_department})`;

              return {
                value: item.id,
                label: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src={getPosterUrl(item.poster_path || item.profile_path)}
                      alt={title}
                      style={{
                        width: "50px",
                        height: "70px",
                        borderRadius: "5px",
                        objectFit: "cover",
                      }}
                    />
                    <span>{title}</span>
                  </div>
                ),
                title,
                media_type: item.media_type,
              };
            })
          );
        });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setShowResults(false);
  };

  //Debounce function to delay calls
  const debounceSearch = useCallback((searchQuery) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchResults(searchQuery);
    }, 500);
  }, []);

  const handleSearch = (text) => {
    if (text.trim() === "") {
      setOptions([]);
      return;
    }
    debounceSearch(text);
  };

  const handleSelect = (movieId, option) => {
    setSelectedMovie(option.title);
    console.log("Selected movie ID:", movieId, option.media_type);
    navigate(`/details/${movieId}/${option.media_type}`);
  };

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
        <Link to="/">
          <div className="title">
            <MovieIcon
              color="white"
              style={{ fontSize: 30, color: "#e50914" }}
            />
            {/* <div className="logo-diamond"></div> */}

            <div className="fonty">
              <div>MovieRidge</div>
            </div>
          </div>
        </Link>

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
          </ul>
        </nav>
        <div className="form">
          <AutoComplete
            options={options}
            // value={selectedMovie}
            style={{
              width: "20rem",
              backgroundColor: "transparent",
              color: "white",
            }}
            placeholder="Search for movies, shows, actors"
            onSearch={handleSearch}
            onSelect={handleSelect}
            variant="borderless"
            loading={showResults}
          />
          <Dropdown
            menu={{
              items,
            }}
          >
            {props.imageURL != null ? (
              <img src={props.imageURL} alt="" />
            ) : (
              <AccountCircleRoundedIcon fontSize="large" />
            )}
          </Dropdown>
        </div>
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
