import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import user from "../assets/user.png";
import movie from "../assets/movie.jpg";
import EditIcon from "@mui/icons-material/Edit";
import "../styles/profile.css";
export default function Profile({ userName, userToken }) {
  const [follwersInfo, setFollowersInfo] = useState({});

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
        <div className="top_profile">
          <img src={user} alt="" />
          <div className="userInfo">
            <div className="name">{userName}</div>
            <div className="followers">{follwersInfo.count} followers</div>
          </div>
          <div className="userActions">
            <div className="edit">
              <EditIcon />
            </div>
          </div>
        </div>
        <div className="tagSection"></div>
        <div className="recentHostings">
          <h3>Recent Hostings</h3>
          <div className="hostingInfo">
            <img src={movie} alt="Movie" />
            <h2 className="movieName">Memento</h2>
            <div className="interactions">442 interacions</div>
          </div>
        </div>
      </div>
    </>
  );
}
