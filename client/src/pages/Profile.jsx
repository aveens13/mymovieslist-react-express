import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import user from "../assets/user.png";
import { Button } from "antd";
import "../styles/profile.css";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";

export default function Profile({ userName, userToken }) {
  const [follwersInfo, setFollowersInfo] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(`/api/followers/${userToken.id}`).then((response) => {
      response.json().then((data) => {
        setFollowersInfo(data);
      });
    });
  }, []);
  return (
    <>
      <div className="main_profile">
        <div className="left-hero-profile">
          <div className="profile-card-hero-main">
            <div className="picture-name-user">
              <img src={user} alt="Profile Picture" />
              <div className="name-user-hero">
                <span className="name-profile">Avinav Bhattarai</span>
                <span className="username-profile">@aveens</span>
              </div>
              <Button
                color="default"
                variant="text"
                style={{
                  backgroundColor: "rgba(30, 30, 30, 255)",
                  color: "white",
                  border: "none",
                  // marginLeft: "1rem",
                }}
                className="edit-button-profile"
              >
                <EditIcon fontSize="small" />
                Edit Profile
              </Button>
            </div>
            <div className="user-following-stat">
              <span>
                1700 <span className="username-profile">followers</span>
              </span>
              <span>
                569 <span className="username-profile">following</span>
              </span>
            </div>
            <div className="user-description-profile">
              <span className="descrip-profile">
                I love watching movies 🍿 with genre thriller and comedy in
                general. Lets connect! ❤️
              </span>
            </div>
            <Button
              type="text"
              className="followbutton-profile"
              style={{
                color: "white",
                backgroundColor: "#e50914",
                width: "50%",
              }}
              loading={loading}
              onClick={() => setLoading(!loading)}
            >
              Follow
            </Button>
          </div>
          <div className="genre-classifier-profile">
            <span>Preferred Genres</span>
            <div className="genre-titles">
              <span>Thriller</span>
              <span>Suspense</span>
              <span>Comedy</span>
              <span>Horror</span>
            </div>
          </div>
        </div>
        <div className="mid-hero-profile">Mid</div>
        <div className="right-hero-profile">right</div>
      </div>
    </>
  );
}
