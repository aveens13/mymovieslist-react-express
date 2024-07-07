import { Button, Space } from "antd";
export default function MovieInfo(props) {
  //Delete movie from the list
  async function deleteFrommyList() {
    let type;
    props.movie.name ? (type = "tv") : (type = "movie");
    return await fetch(
      `/api/deletefromlist/${props.movie.id}/${props.userToken.id}?type=${type}`,
      {
        method: "POST",
      }
    ).then((response) => {
      response.json().then((e) => {
        if (response.ok) {
          props.close();
          props.setSnackbar("success", e.result);
        } else {
          props.setSnackbar("error", e.result);
        }
      });
    });
  }
  return (
    <div className="info--card">
      <div className="movie--info">
        <div className="movie-title-nav">
          {props.movie.title ? (
            <h2>{props.movie.title}</h2>
          ) : (
            <h2>{props.movie.name}</h2>
          )}
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
      <div className="footer-buttons">
        <Button danger type="text" onClick={deleteFrommyList}>
          Delete from my list
        </Button>
      </div>
    </div>
  );
}
