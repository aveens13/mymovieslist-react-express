import "../styles/Home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import user from "../assets/user.png";
import watchparty from "../assets/watchparty.png";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import { Button, Tag } from "antd";

export default function Home({ userToken }) {
  const [followers, setFollowers] = useState([]);
  const [activeStreams, setActiveStreams] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`/api/recommededfollowers/${userToken.id}`)
      .then((response) => response.json())
      .then((data) => setFollowers(data.result))
      .catch((error) => console.error("Error fetching followers:", error));
  }, [userToken.id]);

  useEffect(() => {
    fetch("/api/activeStreams")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActiveStreams(data.streams);
        }
      })
      .catch((error) => console.error("Error fetching active streams:", error));

    const timeoutId = setTimeout(
      () => setRefreshFlag((prev) => prev + 1),
      25000
    );
    return () => clearTimeout(timeoutId);
  }, [refreshFlag]);

  useEffect(() => {
    fetch(`/api/feed/${userToken.id}`)
      .then((response) => response.json())
      .then((data) => setPosts(data.result))
      .catch((error) => console.error("Error fetching feed:", error));
  }, [userToken.id]);

  const getPosterUrl = (posterId) =>
    `https://image.tmdb.org/t/p/original${posterId}`;

  const toggleFollow = (id) => {
    setFollowers((prevFollowers) =>
      prevFollowers.map((follower) =>
        follower.user_id === id
          ? {
              ...follower,
              alreadyFollowed: !follower.alreadyFollowed,
              count: follower.count + 1,
            }
          : follower
      )
    );
    handleUserFollowingAction(id);
  };

  const handleUserFollowingAction = async (targetUserId) => {
    const requestData = JSON.stringify({
      userID: userToken.id,
      targetUserID: targetUserId,
    });
    try {
      await fetch("/api/followuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      });
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  return (
    <div className="tophero">
      <div className="feedsection">
        {posts.map((post) => (
          <div key={post.id} className="feed">
            <div className="feederInfo">
              <img src={user} alt="User" />
              <div>
                <div className="name">{post.author.name}</div>
                <div className="time">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="feedInfo">
              <div className="description">{post.description}</div>
              <div className="image">
                <Link
                  to={`/details/${post.content.id}/${
                    post.content.title ? "movie" : "tv"
                  }`}
                >
                  <img
                    loading="lazy"
                    src={getPosterUrl(
                      post.content.backdrop_path || post.content.poster_path
                    )}
                    alt={post.content.title}
                  />
                </Link>
              </div>
              <div className="movieName">{post.content.title}</div>
              <div className="tags">
                {post.content.genres.map((genre) => (
                  <Tag
                    key={genre.id}
                    color="lime"
                    style={{ borderRadius: "0.8rem" }}
                  >
                    {genre.name}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="infoSection">
        {activeStreams.length > 0 && (
          <div className="watchParty">
            {activeStreams.map((stream) => (
              <Link key={stream.user_id} to={`/broadcast/${stream.user_id}`}>
                <div className="watchPartyDialog">
                  <img src={watchparty} alt="Watch" />
                  <div className="name">{stream.name}</div>
                  <RssFeedIcon color="white" fontSize="small" />
                  <div className="viewers">0 Viewers</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="followCard">
          {followers.map((recommended) => (
            <div key={recommended.user_id} className="followDialog">
              <img src={user} alt="User" />
              <div className="userInfo">
                <div className="name">{recommended.name}</div>
                <div className="followers">{recommended.count} followers</div>
              </div>
              <div className="button">
                {recommended.alreadyFollowed ? (
                  <Button disabled className="buttonDisabled">
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    className="buttonActive"
                    onClick={() => toggleFollow(recommended.user_id)}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
