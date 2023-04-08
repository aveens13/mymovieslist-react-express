export default function MovieInfo(props) {
  return (
    <div className="info--card">
      <div className="movie--info">
        <h2>{props.movie.original_title}</h2>
        <p>{props.movie.overview}</p>
      </div>
    </div>
  );
}
