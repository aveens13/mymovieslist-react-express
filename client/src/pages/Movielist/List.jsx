import "../../styles/list.css";
import { useEffect, useState } from "react";
import Movielist from "./Movielist";
export default function List({ userToken }) {
  const [list, setList] = useState([]);
  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };
  useEffect(() => {
    fetch(`/api/get-movie-list/${userToken.id}`).then((response) => {
      response.json().then((data) => {
        setList(data.result);
      });
    });
  }, []);
  return (
    <div className="listSection">
      <h3>Movie List</h3>
      {list.map((movie) => (
        <Movielist
          movie={movie}
          getPosterUrl={getPosterUrl(movie.poster_path)}
        />
      ))}
    </div>
  );
}
