import { useRef, useState, useEffect } from "react";
import { Button, Space } from "antd";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import MovieElement from "./MovieElement";

export default function Shows({ userToken }) {
  const [tvShow, setTvShow] = useState([]);

  const [snackbarprop, setSnackbarprop] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };
  //Setting up the useeffect for tv shows
  useEffect(() => {
    fetch("/api/tv-shows").then((response) => {
      response.json().then((data) => {
        setTvShow(data.result);
      });
    });
  }, []);

  //handle closing snackbar
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarprop((prev) => {
      return { ...prev, open: false };
    });
  };

  //Add movie to the list
  function handleWatchedMovie(id) {
    return fetch(`/api/add-movie/${id}/${userToken.id}?type=tv`, {
      method: "POST",
    }).then((response) => {
      response
        .json()
        .then((e) => {
          if (response.ok) {
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
        })
        .finally(() => {
          resolve();
        });
    });
  }
  return (
    <>
      <section id="tv slider-container">
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
        <h1 className="main-header">Popular Tv Shows Right Now</h1>
        <div className="movie-slider">
          <div className="movie-list">
            {tvShow.map((showData) => (
              <MovieElement
                movieData={showData}
                handleWatchedMovie={handleWatchedMovie}
                getPosterUrl={getPosterUrl(showData.poster_path)}
                key={showData.id}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
