import "../styles/Home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import user from "../assets/user.png";
import watchparty from "../assets/watchparty.png";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import { Button, Tag, Skeleton } from "antd";

export default function Home({ userToken }) {
  const [followers, setFollowers] = useState([]);
  const [activeStreams, setActiveStreams] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch recommended followers
    fetch(`/api/recommededfollowers/${userToken.id}`)
      .then((response) => response.json())
      .then((data) => setFollowers(data.result))
      .catch((error) => console.error("Error fetching followers:", error))
      .finally(() => setLoading(false));
  }, [userToken.id]);

  useEffect(() => {
    // Fetch active streams
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
    // Fetch feed posts
    setLoading(true);
    fetch(`/api/feed/${userToken.id}`)
      .then((response) => response.json())
      .then((data) => setPosts(data.result))
      .catch((error) => console.error("Error fetching feed:", error))
      .finally(() => setLoading(false));
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
              count: follower.alreadyFollowed
                ? follower.count - 1
                : follower.count + 1,
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="tophero">
      <div className="feedsection">
        <h2 className="feed-title">Your Feed</h2>

        {loading ? (
          // Loading skeleton
          Array(3)
            .fill()
            .map((_, index) => (
              <div key={index} className="feed skeleton-feed">
                <div className="feederInfo">
                  <Skeleton.Avatar active size={40} />
                  <div className="skeleton-text">
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </div>
                </div>
                <div className="feedInfo">
                  <Skeleton active paragraph={{ rows: 2 }} />
                  <div className="image skeleton-image">
                    <Skeleton.Image active />
                  </div>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </div>
              </div>
            ))
        ) : posts.length === 0 ? (
          <div className="empty-feed">
            <p>No posts to show. Follow more users to see their activity!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="feed">
              <div className="feederInfo">
                <img src={user} alt="User" className="user-avatar" />
                <div>
                  <div className="name">{post.author.name}</div>
                  <div className="time">{formatDate(post.createdAt)}</div>
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
                      alt={post.content.title || "Content"}
                    />
                  </Link>
                </div>
                <div className="movieName">
                  {post.content.title || post.content.name}
                </div>
                <div className="tags">
                  {post.content.genres &&
                    post.content.genres.map((genre) => (
                      <Tag
                        key={genre.id}
                        color="lime"
                        style={{ borderRadius: "0.8rem" }}
                      >
                        {genre.name}
                      </Tag>
                    ))}
                </div>
                <div className="interactionsSection">
                  <div className="interaction-buttons">
                    <button className="interaction-btn">
                      <FavoriteBorderIcon className="interaction-icon" />
                      <span>Like</span>
                    </button>
                    <button className="interaction-btn">
                      <ChatBubbleOutlineIcon className="interaction-icon" />
                      <span>Comment</span>
                    </button>
                    <button className="interaction-btn">
                      <ShareIcon className="interaction-icon" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="infoSection">
        {activeStreams.length > 0 && (
          <div className="watchParty">
            <h3 className="section-title">Live Watch Parties</h3>
            {activeStreams.map((stream) => (
              <Link key={stream.user_id} to={`/broadcast/${stream.user_id}`}>
                <div className="watchPartyDialog">
                  <div className="live-indicator"></div>
                  <img src={watchparty} alt="Watch" />
                  <div className="name">{stream.name}</div>
                  <RssFeedIcon className="stream-icon" />
                  <div className="viewers">
                    <span className="viewer-count">0</span> Viewers
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="followCard">
          <h3 className="section-title">Suggested For You</h3>
          {loading ? (
            // Skeleton loading for followers
            Array(3)
              .fill()
              .map((_, index) => (
                <div key={index} className="followDialog skeleton-follow">
                  <Skeleton.Avatar active size={40} />
                  <div className="skeleton-text">
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </div>
                  <Skeleton.Button active />
                </div>
              ))
          ) : followers.length === 0 ? (
            <div className="empty-followers">
              <p>No recommendations available at this time.</p>
            </div>
          ) : (
            followers.map((recommended) => (
              <div key={recommended.user_id} className="followDialog">
                <img src={user} alt="User" className="user-avatar" />
                <div className="userInfo">
                  <div className="name">{recommended.name}</div>
                  <div className="followers">{recommended.count} followers</div>
                </div>
                <div className="button">
                  {recommended.alreadyFollowed ? (
                    <Button
                      onClick={() => toggleFollow(recommended.user_id)}
                      className="buttonDisabled"
                    >
                      Following
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
