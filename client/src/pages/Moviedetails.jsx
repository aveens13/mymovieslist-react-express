import { Button, Card, Space } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Details.css";
import image from "../assets/OIP.jpg";
export const MovieDetails = () => {
  const [data, setData] = useState({
    info: {},
    credits: {
      cast: [],
      crew: [],
    },
  });
  let { id } = useParams();
  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (await fetch(`/api/details/${id}?type=movie`)).json();
      setData(data);
    };

    dataFetch();
  }, []);

  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };

  return (
    <div className="details-hero">
      <div className="top--section">
        <div className="image--drop">
          <img src={getPosterUrl(data.info.poster_path)} alt="Movie Backdrop" />
        </div>
        <div className="movie-info">
          <ul>
            <li>
              <p className="title">{data.info.title}</p>
            </li>
            <li>
              <p className="bold">Type:</p>
              <p className="light">Movie</p>
            </li>
            <li>
              <p className="bold">Genre:</p>
              <p className="light">Action</p>
            </li>
            <li>
              <p className="bold">Release:</p>
              <p className="light">{data.info.release_date}</p>
            </li>
            <li>
              <p className="bold">Director:</p>
              {data.credits.crew.map(
                (crew) =>
                  crew.job == "Director" && <p className="light">{crew.name}</p>
              )}
            </li>
            <li>
              <p className="bold">Cast:</p>
              {data.credits.cast.slice(0, 3).map((cast, index) => (
                <p className="light" key={index}>
                  {cast.name}
                </p>
              ))}
              {data.credits.cast.length > 3 && (
                <Button type="link">See more</Button>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="details-section">
        <div className="description">{data.info.overview}</div>
        <div className="actions">
          <Button
            type="primary"
            // loading={loading}
            className="btn-watch"
            // value={props.movieData.id}
            // onClick={handleClick}
          >
            Add to list
          </Button>
        </div>
      </div>
    </div>
  );
};
