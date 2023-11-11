import { useState } from "react";
import Modal from "../Modal/Modal";
import MovieInfo from "./Movieinfo";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
export default function Movielist(props) {
  const [isShowing, setIsShowing] = useState(false);
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
      <div className="card--main" onClick={() => setIsShowing(!isShowing)}>
        <div className="card--hero">
          <div className="img">
            <img src={props.getPosterUrl} alt="Movie" />
          </div>
          <div className="content">
            {props.movie.title ? (
              <h2>{props.movie.title}</h2>
            ) : (
              <h2>{props.movie.name}</h2>
            )}
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
    </>
  );
}
