import { useState } from "react";
import Modal from "../Modal/Modal";
// import Modal from "react-modal";
import MovieInfo from "./Movieinfo";
export default function Movielist(props) {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <>
      <div className="card--main" onClick={() => setIsShowing(!isShowing)}>
        <div className="card--hero">
          <div className="img">
            <img src={props.getPosterUrl} alt="Movie" />
          </div>
          <div className="content">
            <h2>{props.movie.original_title}</h2>
            <p>{props.movie.overview}</p>
          </div>
        </div>
      </div>
      <Modal open={isShowing} close={() => setIsShowing(false)}>
        <MovieInfo movie={props.movie} />
      </Modal>
    </>
  );
}