import { Button, Card, Space } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import "../styles/Details.css";
import image from "../assets/OIP.jpg";
export const MovieDetails = () => {
  const [data, setData] = useState(null);
  let { id, type } = useParams();
  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(`/api/details/${id}?type=${type}`)
      ).json();
      setData(data);
    };

    dataFetch();
  }, [id]);

  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };

  return (
    <div className="details-hero">
      {type != "person"
        ? data && (
            <>
              <div className="top--section">
                <div className="image--drop">
                  <img
                    src={getPosterUrl(data.info.poster_path)}
                    alt="Movie Backdrop"
                  />
                </div>
                <div className="movie-info">
                  <ul>
                    <li>
                      <div className="title-section">
                        {type == "tv" ? (
                          <p className="title">{data.info.name}</p>
                        ) : (
                          <p className="title">{data.info.title}</p>
                        )}
                        <div className="ratings">
                          <p>
                            <StarIcon />
                            {data.info.vote_average}
                          </p>
                          {type == "tv" ? (
                            <p className="runtime">
                              {data.info.number_of_episodes} Episodes
                            </p>
                          ) : (
                            <p className="runtime">
                              {data.info.runtime} minutes
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                    <li>
                      <p className="bold">Type:</p>
                      <p className="light">{type}</p>
                    </li>
                    <li>
                      <p className="bold">Genre:</p>
                      {data.info.genres.map((genre) => (
                        <p className="light">{genre.name}</p>
                      ))}
                    </li>
                    <li>
                      <p className="bold">Release:</p>
                      {type == "tv" ? (
                        <p className="light">{data.info.first_air_date}</p>
                      ) : (
                        <p className="light">{data.info.release_date}</p>
                      )}
                    </li>
                    {type == "tv" ? (
                      <li>
                        <p className="bold">Status:</p>
                        <p className="light">{data.info.status}</p>
                      </li>
                    ) : (
                      <li>
                        <p className="bold">Director:</p>
                        {data.credits.crew.map(
                          (crew) =>
                            crew.job == "Director" && (
                              <p className="light">{crew.name}</p>
                            )
                        )}
                      </li>
                    )}
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
            </>
          )
        : data && (
            <>
              <div className="top--section">
                <div className="image--drop">
                  <img
                    src={getPosterUrl(data.info.profile_path)}
                    alt="Movie Backdrop"
                  />
                </div>
                <div className="movie-info">
                  <ul>
                    <li>
                      <div className="title-section">
                        <p className="title">{data.info.name}</p>
                      </div>
                    </li>
                    <li>
                      <p className="bold">Role:</p>
                      <p className="light">{data.info.known_for_department}</p>
                    </li>
                    <li>
                      <p className="bold">Gender:</p>
                      {data.info.gender == 0 ? (
                        <p className="light">Not Specified</p>
                      ) : data.info.gender == 1 ? (
                        <p className="light">Female</p>
                      ) : (
                        <p className="light">Male</p>
                      )}
                    </li>
                    <li>
                      <p className="bold">Birthdate:</p>
                      <p className="light">{data.info.birthday}</p>
                    </li>
                    <li>
                      <p className="bold">Birth:</p>
                      <p className="light">{data.info.place_of_birth}</p>
                    </li>
                    <li>
                      <p className="bold">Known:</p>
                      {data.info.also_known_as
                        .slice(0, 3)
                        .map((cast, index) => (
                          <p className="light" key={index}>
                            {cast}
                          </p>
                        ))}
                      {data.info.also_known_as.length > 3 && (
                        <Button type="link">See more</Button>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="details-section">
                <div className="description">{data.info.biography}</div>
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
            </>
          )}
    </div>
  );
};
