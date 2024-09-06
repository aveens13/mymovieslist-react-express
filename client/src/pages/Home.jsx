import "../styles/Home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import user from "../assets/user.png";
import watchparty from "../assets/watchparty.png";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import "../styles/Home.css";
import { Button, Tag } from "antd";
export default function Home({ userToken }) {
  const [type, setType] = useState("movie");
  const [followers, setFollowers] = useState([]);
  const [activeStreams, setActiveStreams] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [posts, setPosts] = useState([]);
  //Fetch followers
  useEffect(() => {
    fetch(`/api/recommededfollowers/${userToken.id}`).then((response) => {
      response.json().then((data) => {
        setFollowers(data.result);
      });
    });
  }, []);

  //Fetch active streams
  useEffect(() => {
    fetch("/api/activeStreams").then((response) => {
      try {
        if (!response.ok) {
          throw new Error("Failed to fetch active streams");
        }
        response.json().then((data) => {
          if (data.success) {
            setActiveStreams(data.streams);
          } else {
            throw new Error("Failed to fetch active streams");
          }
        });
      } catch (error) {
        console.error("Error fetching active streams:", error);
      }
    });

    // Set up the next refresh
    const timeoutId = setTimeout(
      () => setRefreshFlag((prev) => prev + 1),
      25000
    );

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [refreshFlag]);

  //Get feed
  useEffect(() => {
    fetch(`/api/feed/${userToken.id}`).then((response) => {
      response.json().then((data) => {
        setPosts(data.result);
      });
    });
  }, []);

  //Get the image for the movie poster
  const getPosterUrl = (posterId) => {
    return `https://image.tmdb.org/t/p/original${posterId}`;
  };

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
    const requestData = {
      userID: userToken.id,
      targetUserID: targetUserId,
    };

    console.log(requestData);

    const requestDataJsonString = JSON.stringify(requestData);

    const response = await fetch("/api/followuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestDataJsonString,
    });

    // Handle the response here
    if (response.ok) {
      // Process successful response
    } else {
      // Handle error
    }
  };
  return (
    <>
      <div className="tophero">
        <div className="feedsection">
          {posts.map((post) => (
            <div className="feed">
              <div className="feederInfo">
                <img src={user} alt="" />
                <div>
                  <div className="name">{post.author.name}</div>
                  <div className="time">
                    {new Date(post.createdAt).toString()}
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
                    {post.content.backdrop_path ? (
                      <img
                        loading="lazy"
                        src={getPosterUrl(post.content.backdrop_path)}
                        alt=""
                      />
                    ) : (
                      <img
                        loading="lazy"
                        src={getPosterUrl(post.content.poster_path)}
                        alt=""
                      />
                    )}
                  </Link>
                </div>
                <div className="movieName">{post.content.title}</div>
                <div className="tags">
                  {post.content.genres.map((genre) => (
                    <Tag color="lime" style={{ borderRadius: "0.8rem" }}>
                      {genre.name}
                    </Tag>
                  ))}
                </div>
                {/* <div className="interactionsSection">
                  {isHeart ? (
                    <img
                      src={loveFilled}
                      alt=""
                      onClick={() => setIsHeart(!isHeart)}
                    />
                  ) : (
                    <img
                      src={love}
                      alt=""
                      onClick={() => setIsHeart(!isHeart)}
                    />
                  )}
                </div> */}
              </div>
            </div>
          ))}
        </div>
        <div className="infoSection">
          {activeStreams.length > 0 && (
            <div className="watchParty">
              {activeStreams.map((stream) => (
                <Link to={`/broadcast/${stream.user_id}`}>
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
              <div className="followDialog">
                <img src={user} alt="Userimage" />
                <div className="userInfo">
                  <div className="name">{recommended.name}</div>
                  <div className="followers">{recommended.count} followers</div>
                </div>
                <div className="button">
                  {recommended.alreadyFollowed ? (
                    <Button
                      disabled
                      className="buttonDisabled"
                      key={recommended.user_id}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      className="buttonActive"
                      key={recommended.user_id}
                      onClick={() => {
                        toggleFollow(recommended.user_id);
                      }}
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
    </>
  );
}
