import * as React from "react";
import { useRef, useState, useEffect } from "react";
import "../styles/Movie.css";
import MovieElement from "./MovieElement";
import Moviecard from "./Moviecard";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "../styles/MovieCard.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

export default function Movie({ userToken }) {
  const [movie, setMovie] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [snackbarprop, setSnackbarprop] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  //Get the image for the movie poster
  const getPosterUrl = (posterId) => {
    return `https://image.tmdb.org/t/p/original${posterId}`;
  };

  //Setting up the useeffect for movies
  useEffect(() => {
    fetch("/api/movies").then((response) => {
      response.json().then((data) => {
        setMovie(data.result.popular);
      });
    });
  }, []);

  useEffect(() => {
    fetch(`/api/get-recommendations/${userToken.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Recommendations data:", data); // Ensure data is received correctly
        setRecommendations(data.result);
        console.log(data.result);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
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

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -800, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 800, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

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
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPreview={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="swiper_container"
        >
          {movie.map((movieData) => (
            <SwiperSlide>
              <Moviecard
                movieData={movieData}
                getPosterUrl={getPosterUrl(movieData.backdrop_path)}
                handleWatchedMovie={handleWatchedMovie}
                key={movieData.id}
              />
            </SwiperSlide>
          ))}

          <div className="slider-controller">
            <div className="swiper-button-prev slider-arrow">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
            <div className="swiper-button-next slider-arrow">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </Swiper>
        <div className="recommendation-section">
          <h1 className="section-title">
            <span className="highlight">|</span> Recommended for you
          </h1>

          <div className="slider-container">
            {showLeftArrow && (
              <button
                className="slider-arrow slider-arrow-left"
                onClick={scrollLeft}
              >
                <ArrowBackIosNewIcon />
              </button>
            )}

            <div className="movie-list" ref={sliderRef} onScroll={handleScroll}>
              {recommendations.map((movieData) => (
                <MovieElement
                  key={movieData.id}
                  movieData={movieData}
                  getPosterUrl={getPosterUrl(movieData.poster_path)}
                  handleWatchedMovie={handleWatchedMovie}
                />
              ))}
            </div>

            {showRightArrow && (
              <button
                className="slider-arrow slider-arrow-right"
                onClick={scrollRight}
              >
                <ArrowForwardIosIcon />
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
