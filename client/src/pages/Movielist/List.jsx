import "../../styles/list.css";
import { useEffect, useState } from "react";
import Movielist from "./Movielist";
export default function List({ userToken }) {
  const [list, setList] = useState([]);
  const [show, setShow] = useState([]);
  const [data, setData] = useState([]);
  const getPosterUrl = (posterId) => {
    return `https://image.tmdb.org/t/p/original${posterId}`;
  };

  useEffect(() => {
    fetch(`/api/get-movie-list/${userToken.id}`).then((response) => {
      response.json().then((e) => {
        console.log(e);
        setList(e.data.result);
        setData(e.data.result);
      });
    });
  }, []);

  useEffect(() => {
    fetch(`/api/get-show-list/${userToken.id}`).then((response) => {
      response.json().then((data) => {
        setShow(data.result);
      });
    });
  }, []);
  return (
    <div className="listSection">
      <div className="top-buttons">
        <h3 onClick={() => setData(list)}>Movie List</h3>
        <h3 onClick={() => setData(show)}>Shows List</h3>
      </div>
      {data.map((movie) => (
        <Movielist
          movie={movie}
          userToken={userToken}
          getPosterUrl={getPosterUrl(movie.poster_path)}
        />
      ))}
    </div>
  );
}
