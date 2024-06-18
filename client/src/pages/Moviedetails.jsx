import { Button, notification, Space, Rate, message } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import Bookmark from "../assets/bookmark.png";
import "../styles/Details.css";
import { Container } from "react-bootstrap";
const desc = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];

export const MovieDetails = ({ userToken }) => {
  const [data, setData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [value, setValue] = useState(5);
  const [loading, setLoading] = useState(false);
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
    const dataFetch = async () => {
      const data = await (
        await fetch(`/api/details/${id}?type=${type}`)
      ).json();
      setData(data);
    };

    // const videoFetch = async () => {
    //   const data = await (await fetch(`/api/video/${id}?type=${type}`)).json();
    //   setVideoData(data);
    // };

    dataFetch();
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
    setLoading(true);
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

          setLoading(false);
        } else {
          setSnackbarprop({
            open: true,
            message: e.result,
            severity: "error",
          });

          setLoading(false);
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
                    <iframe
                      src={`https://vidsrc.to/embed/tv/${id}`}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
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
