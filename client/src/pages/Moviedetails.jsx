import { Card, Space } from "antd";
import { useParams } from "react-router-dom";
export const MovieDetails = () => {
  let { id } = useParams();
  return <div>Movie Info {id}</div>;
};
