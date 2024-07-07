import { useState } from "react";
import Modal from "../Modal/Modal";
import MovieInfo from "./Movieinfo";
import MovieShare from "./MovieShare";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
export default function Movielist(props) {
  const [isShowing, setIsShowing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [snackbarprop, setSnackbarprop] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  //handle closing snackbar
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarprop((prev) => {
      return { ...prev, open: false };
    });
  };

  function handleSettingSnackbar(sev, mes) {
    return setSnackbarprop((prev) => {
      return { ...prev, open: true, severity: sev, message: mes };
    });
  }
  return (
    <>
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
      <div className="card--main">
        <div className="card--hero">
          <div
            className="img"
            onClick={() => {
              setIsSharing(false);
              setIsShowing(!isShowing);
            }}
          >
            <img src={props.getPosterUrl} alt="Movie" />
          </div>
          <div className="content">
            <div className="titleSection">
              {props.movie.title ? (
                <h2>{props.movie.title}</h2>
              ) : (
                <h2>{props.movie.name}</h2>
              )}
              <ShareIcon
                color="white"
                className="share"
                fontSize="small"
                onClick={() => {
                  setIsShowing(false);
                  setIsSharing(!isSharing);
                }}
              />
            </div>
            <p>{props.movie.overview}</p>
          </div>
        </div>
      </div>
      <Modal open={isShowing} close={() => setIsShowing(false)}>
        <MovieInfo
          movie={props.movie}
          userToken={props.userToken}
          setSnackbar={handleSettingSnackbar}
          close={() => setIsShowing(!isShowing)}
        />
      </Modal>
      <Modal open={isSharing} close={() => setIsSharing(false)}>
        <MovieShare
          movie={props.movie}
          userToken={props.userToken}
          setSnackbar={handleSettingSnackbar}
          getPosterUrl={props.getPosterUrl}
          close={() => setIsSharing(!isSharing)}
        />
      </Modal>
    </>
  );
}
