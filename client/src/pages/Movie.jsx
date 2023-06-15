import * as React from "react";
import { useRef, useState, useEffect } from "react";
import "../styles/Movie.css";
import MovieElement from "./MovieElement";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export default function Movie({ userToken }) {
  const [movie, setMovie] = useState([]);
  const [snackbarprop, setSnackbarprop] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  //Get the image for the movie poster
  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };

  //Setting up the useeffect for movies
  useEffect(() => {
    fetch("/api/movies").then((response) => {
      response.json().then((data) => {
        console.log(data);
        setMovie(data.result);
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
    return fetch(`/api/add-movie/${id}/${userToken.id}?type=movie`, {
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
      <section id="slider-container">
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
        <h1 className="main-header">Popular Movies Right Now</h1>
        <div className="movie-slider">
          <div className="movie-list">
            {movie.map((movieData) => (
              <MovieElement
                movieData={movieData}
                getPosterUrl={getPosterUrl(movieData.poster_path)}
                handleWatchedMovie={handleWatchedMovie}
                key={movieData.id}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
