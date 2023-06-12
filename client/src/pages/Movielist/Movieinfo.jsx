import { Button, Space } from "antd";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { useState } from "react";
export default function MovieInfo(props) {
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

  //Delete movie from the list
  function deleteFrommyList() {
    let type;
    props.movie.name ? (type = "tv") : (type = "movie");
    return fetch(
      `/api/deletefromlist/${props.movie.id}/${props.userToken.id}?type=${type}`,
      {
        method: "POST",
      }
    ).then((response) => {
      response.json().then((e) => {
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
      });
    });
  }
  return (
    <div className="info--card">
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
      <div className="movie--info">
        <div className="movie-title-nav">
          {props.movie.original_title ? (
            <h2>{props.movie.original_title}</h2>
          ) : (
            <h2>{props.movie.name}</h2>
          )}
          <Button danger type="link" onClick={deleteFrommyList}>
            Delete from my list
          </Button>
        </div>
        {props.movie.overview ? (
          <p>{props.movie.overview}</p>
        ) : (
          <p>
            You added this series on your list. Sorry, we dont have additional
            info about this series
          </p>
        )}
      </div>
    </div>
  );
}
