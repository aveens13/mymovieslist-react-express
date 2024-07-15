import { Button, notification, Space, Rate, message } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import StarIcon from "@mui/icons-material/Star";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import Bookmark from "../assets/bookmark.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "../styles/Details.css";
import loadingImg from "../assets/movieridge.gif";
const desc = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];

export const MovieDetails = ({ userToken }) => {
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const [data, setData] = useState(null);
  const [value, setValue] = useState(5);
  const [loading, setLoading] = useState(false);
  const [episodeLoader, setEpisodeLoader] = useState({
    seasonNumber: 1,
    episodeNumber: 1,
  });
  const [seasonActive, setSeasonActive] = useState(false);
  const [seasonDetails, setSeasonDetails] = useState({});
  const [snackbarprop, setSnackbarprop] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, messageContext] = message.useMessage();

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button
          danger
          type="primary"
          size="small"
          onClick={() => api.destroy()}
        >
          Cancel
        </Button>
        <Button type="primary" size="small" onClick={() => handleAddtoList()}>
          Add to my list
        </Button>
      </Space>
    );
    api.open({
      message: "Not on your list",
      description:
        "Want to update your list? Click add button below to add this to your list. ( PS: You need to rate it again 😊)",
      btn,
      key,
    });
  };

  let { id, type } = useParams();
  useEffect(() => {
    // fetch data
    setLoading(true);
    const dataFetch = async () => {
      const data = await (
        await fetch(`/api/details/${id}?type=${type}`)
      ).json();
      setData(data);
      setSeasonActive(false);
      setEpisodeLoader({
        seasonNumber: 1,
        episodeNumber: 1,
      });
    };

    // const videoFetch = async () => {
    //   const data = await (await fetch(`/api/video/${id}?type=${type}`)).json();
    //   setVideoData(data);
    // };

    dataFetch().then(() => {
      setLoading(false);
    });
    // videoFetch();
  }, [id]);

  const getPosterUrl = (posterId) => {
    return `https://image.tmdb.org/t/p/original${posterId}`;
  };

  //handle closing snackbar
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarprop((prev) => {
      return { ...prev, open: false };
    });
  };

  //Post api to add the movie to the user's list
  const handleAddtoList = () => {
    fetch(`/api/add-movie/${id}/${userToken.id}?type=${type}`, {
      method: "POST",
    }).then((res) => {
      res.json().then((e) => {
        if (res.ok) {
          setSnackbarprop({
            open: true,
            message: e.result,
            severity: "success",
          });
        } else {
          setSnackbarprop({
            open: true,
            message: e.result,
            severity: "error",
          });
        }
      });
    });
  };

  async function updateRating() {
    const response = await fetch(
      `/api/update-movie/${id}/${userToken.id}?type=${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: value,
        }),
      }
    );

    response.json().then((e) => {
      if (response.ok) {
        messageApi.open({
          type: "success",
          content: "Thank you for rating 😊",
        });
        console.log(e);
      } else {
        if (e.code == "P2025") {
          openNotification();
        } else {
          api.open({
            message: "Error",
            description: e.message,
          });
        }
      }
    });
  }

  async function handleSeasonQuery(seasonNumber) {
    setLoading(true);
    const response = await fetch(
      `/api/tv/seasons?seriesId=${id}&seasonNumber=${seasonNumber}`
    );

    if (response.ok) {
      response.json().then((e) => {
        setSeasonDetails(e.result);
        setSeasonActive(!seasonActive);
        setLoading(false);
        console.log(seasonDetails);
      });
    }
  }

  async function init() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        console.log("Setting video source...");
        if (stream.active) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .then(() => console.log("Video playing"))
            .catch((error) => console.error("Error playing video:", error));
        } else {
          console.error("Stream is not active");
        }
      } else {
        console.error("Video ref is null");
      }
      const peer = createPeer();
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
        // Listen for the 'ended' event to handle when the user stops sharing
        track.addEventListener("ended", () => {
          console.log("User stopped sharing");
          stopSharing();
        });
      });

      // Add beforeunload event listener
      const handleBeforeUnload = async (event) => {
        console.log("Browser is about to close");
        event.preventDefault(); // Cancel the event
        event.returnValue = ""; // Chrome requires returnValue to be set
        await stopSharing();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Store the handleBeforeUnload function so we can remove it later
      streamRef.current.handleBeforeUnload = handleBeforeUnload;
    } catch (error) {
      console.error("Error accessing display media.", error);
    }
  }

  function createPeer() {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "0df9a5d34563a36ffade45c9",
          credential: "qpUfgv53MDLcdugm",
        },
      ],
    });

    // Add these event listeners
    peer.addEventListener("icecandidateerror", (event) => {
      console.error("ICE candidate error:", event);
      console.error("Error code:", event.errorCode);
      console.error("Error text:", event.errorText);
      console.error("Server URL:", event.url);
      console.error("Host candidate:", event.hostCandidate);
    });

    peer.addEventListener("icecandidate", (event) => {
      console.log(event.candidate);
    });

    peer.addEventListener("connectionstatechange", () => {
      console.log("Connection state:", peer.connectionState);
    });

    peer.addEventListener("iceconnectionstatechange", () => {
      console.log("ICE connection state:", peer.iceConnectionState);
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    return peer;
  }

  async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    // Wait for ICE gathering to complete
    await new Promise((resolve) => {
      if (peer.iceGatheringState === "complete") {
        resolve();
      } else {
        peer.addEventListener("icegatheringstatechange", () => {
          if (peer.iceGatheringState === "complete") {
            resolve();
          }
        });
      }
    });
    const payload = {
      sdp: peer.localDescription,
      streamerID: userToken.id,
    };

    const response = await fetch(`/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    response.json().then((e) => {
      const desc = new RTCSessionDescription(e.result.sdp);
      console.log(e.result);
      peer.setRemoteDescription(desc).catch((event) => console.log(event));
    });
  }

  async function stopSharing() {
    // Remove the beforeunload event listener if it exists
    if (streamRef.current && streamRef.current.handleBeforeUnload) {
      window.removeEventListener(
        "beforeunload",
        streamRef.current.handleBeforeUnload
      );
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    const jsonBody = {
      streamerID: userToken.id,
    };
    const response = await fetch(`/api/endBroadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonBody),
    });

    response.json().then((e) => {
      console.log(e.result);
    });
  }

  return (
    <div className="details-hero">
      {contextHolder}
      {messageContext}
      <Snackbar
        open={snackbarprop.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarprop.severity}
          sx={{ width: "100%" }}
        >
          {snackbarprop.message}
        </Alert>
      </Snackbar>
      {type != "person"
        ? data && (
            <div className="details-section-hero">
              <div className="top--section">
                <div className="image--drop">
                  <img
                    src={getPosterUrl(data.info.poster_path)}
                    alt="Movie Backdrop"
                  />
                </div>
                <div className="movie-info">
                  <ul>
                    <li>
                      <div className="title-section">
                        {type == "tv" ? (
                          <p className="title">{data.info.name}</p>
                        ) : (
                          <p className="title">{data.info.title}</p>
                        )}
                        <div className="ratings">
                          <p>
                            <StarIcon />
                            TMDB Rating ({data.info.vote_average})
                          </p>
                          {type == "tv" ? (
                            <p className="runtime">
                              {data.info.number_of_episodes} Episodes
                            </p>
                          ) : (
                            <p className="runtime">
                              {data.info.runtime} minutes
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                    <li>
                      <p className="bold">Type:</p>
                      <p className="light">{type}</p>
                    </li>
                    <li>
                      <p className="bold">Genre:</p>
                      {data.info.genres.map((genre) => (
                        <p className="light">{genre.name}</p>
                      ))}
                    </li>
                    <li>
                      <p className="bold">Release:</p>
                      {type == "tv" ? (
                        <p className="light">{data.info.first_air_date}</p>
                      ) : (
                        <p className="light">{data.info.release_date}</p>
                      )}
                    </li>
                    {type == "tv" ? (
                      <li>
                        <p className="bold">Status:</p>
                        <p className="light">{data.info.status}</p>
                      </li>
                    ) : (
                      <li>
                        <p className="bold">Director:</p>
                        {data.credits.crew.map(
                          (crew) =>
                            crew.job == "Director" && (
                              <p className="light">{crew.name}</p>
                            )
                        )}
                      </li>
                    )}
                    <li>
                      <p className="bold">Cast:</p>
                      {data.credits.cast.slice(0, 3).map((cast, index) => (
                        <p className="light" key={index}>
                          {cast.name}
                        </p>
                      ))}
                      {data.credits.cast.length > 3 && (
                        <Button type="link">See more</Button>
                      )}
                    </li>
                  </ul>
                </div>
                <div className="rating--hero">
                  <div className="actions">
                    <img
                      src={Bookmark}
                      alt="Add to list"
                      className="addtolistButton"
                      onClick={handleAddtoList}
                    />
                    <p className="tooltiptext">Add to list</p>
                  </div>
                  <h3>Have you watched this ? Rate it</h3>
                  <span>
                    <Rate tooltips={desc} onChange={setValue} value={value} />
                    {value ? (
                      <span className="ant-rate-text">{desc[value - 1]}</span>
                    ) : (
                      ""
                    )}
                  </span>
                  <Button type="primary" onClick={updateRating}>
                    Submit
                  </Button>
                </div>
              </div>
              <div className="details-section">
                <div className="description">{data.info.overview}</div>
                {type == "movie" ? (
                  <div className="trailer-section">
                    <iframe
                      src={`https://vidsrc.pro/embed/movie/${id}`}
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="trailer-section">
                    {loading ? (
                      <div className="loadingClass">
                        <img src={loadingImg} alt="" />
                      </div>
                    ) : (
                      data.info.seasons &&
                      (seasonActive ? (
                        <div className="episode-info">
                          <div
                            className="seasonTitle"
                            onClick={() => {
                              setSeasonActive(!seasonActive);
                            }}
                          >
                            {seasonDetails.name}
                            <ArrowDropDownIcon color="white" />
                          </div>
                          <div className="episodes">
                            {seasonDetails?.episodes.map((episode) => (
                              <div
                                className={
                                  episodeLoader.episodeNumber ==
                                  episode.episode_number
                                    ? "episode-selected"
                                    : "episode"
                                }
                                onClick={() => {
                                  setEpisodeLoader({
                                    seasonNumber: episode.season_number,
                                    episodeNumber: episode.episode_number,
                                  });
                                }}
                              >
                                Episode {episode.episode_number}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="season-info">
                          {data.info.seasons?.map(
                            (season) =>
                              season.season_number != 0 && (
                                <div
                                  className="season"
                                  key={season.season_number}
                                  onClick={() =>
                                    handleSeasonQuery(season.season_number)
                                  }
                                >
                                  <img
                                    src={getPosterUrl(season.poster_path)}
                                    alt=""
                                  />
                                  <div className="name">{season.name}</div>
                                </div>
                              )
                          )}
                        </div>
                      ))
                    )}
                    <iframe
                      src={`https://vidsrc.pro/embed/tv/${id}/${episodeLoader.seasonNumber}/${episodeLoader.episodeNumber}`}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                <Button danger type="primary" onClick={() => init()}>
                  Stat Broadcast
                </Button>
                {/* <video
                  ref={videoRef}
                  style={{ width: "100%", maxWidth: "640px", height: "auto" }}
                ></video> */}
              </div>
            </div>
          )
        : data && (
            <div className="details-section-hero">
              <div className="top--section">
                <div className="image--drop">
                  <img
                    src={getPosterUrl(data.info.profile_path)}
                    alt="Movie Backdrop"
                  />
                </div>
                <div className="movie-info">
                  <ul>
                    <li>
                      <div className="title-section">
                        <p className="title">{data.info.name}</p>
                      </div>
                    </li>
                    <li>
                      <p className="bold">Role:</p>
                      <p className="light">{data.info.known_for_department}</p>
                    </li>
                    <li>
                      <p className="bold">Gender:</p>
                      {data.info.gender == 0 ? (
                        <p className="light">Not Specified</p>
                      ) : data.info.gender == 1 ? (
                        <p className="light">Female</p>
                      ) : (
                        <p className="light">Male</p>
                      )}
                    </li>
                    <li>
                      <p className="bold">Birthdate:</p>
                      <p className="light">{data.info.birthday}</p>
                    </li>
                    <li>
                      <p className="bold">Birth:</p>
                      <p className="light">{data.info.place_of_birth}</p>
                    </li>
                    <li>
                      <p className="bold">Known:</p>
                      {data.info.also_known_as
                        .slice(0, 3)
                        .map((cast, index) => (
                          <p className="light" key={index}>
                            {cast}
                          </p>
                        ))}
                      {data.info.also_known_as.length > 3 && (
                        <Button type="link">See more</Button>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="details-section">
                <div className="description">{data.info.biography}</div>
                <div className="actions"></div>
              </div>
            </div>
          )}
    </div>
  );
};
