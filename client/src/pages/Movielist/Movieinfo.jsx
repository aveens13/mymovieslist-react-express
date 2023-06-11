export default function MovieInfo(props) {
  return (
    <div className="info--card">
      <div className="movie--info">
        {props.movie.original_title ? (
          <h2>{props.movie.original_title}</h2>
        ) : (
          <h2>{props.movie.name}</h2>
        )}
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
