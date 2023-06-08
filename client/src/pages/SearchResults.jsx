import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
function SearchResults({ query, queryClick }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  //Get the image for the movie poster
  const getPosterUrl = (posterId) => {
    return `https://www.themoviedb.org/t/p/w220_and_h330_face${posterId}`;
  };

  const timerRef = useRef(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/search?name=${query}`, {
          method: "POST",
        });
        if (response.ok) {
          response.json().then((e) => {
            setResults(e.result);
            console.log(e.result);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    function startTimer() {
      clearTimer();
      timerRef.current = setInterval(fetchData, 500);
    }

    function clearTimer() {
      clearInterval(timerRef.current);
    }

    // Start the timer when the component mounts or the query changes
    startTimer();

    // Clear the timer when the component unmounts or the query changes
    return () => {
      clearTimer();
    };
  }, [query]);

  return (
    <div>
      {loading ? (
        <p>Loading search results...</p>
      ) : results ? (
        <ul>
          {results.map((result) => (
            <Link to={`/details/${result.id}/${result.media_type}`}>
              <li key={result.id} onClick={() => queryClick()}>
                {result.media_type == "person" ? (
                  <img src={getPosterUrl(result.profile_path)} alt="" />
                ) : (
                  <img src={getPosterUrl(result.poster_path)} alt="" />
                )}
                <div>
                  {result.media_type == "movie" && (
                    <div>
                      <h3>{result.title}</h3>
                      <h4>
                        {new Date(result.release_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </h4>
                    </div>
                  )}
                  {result.media_type == "tv" && (
                    <div>
                      <h3>{result.name}</h3>
                      <h4>
                        {new Date(result.first_air_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </h4>
                    </div>
                  )}
                  {result.media_type == "person" && (
                    <div>
                      <h3>{result.name}</h3>
                      <h4>{result.known_for_department}</h4>
                    </div>
                  )}

                  <h4>{result.media_type.toUpperCase()}</h4>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <h3>No Results Found</h3>
      )}
    </div>
  );
}

export default SearchResults;
