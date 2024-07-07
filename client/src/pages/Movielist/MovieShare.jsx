import { Input, Button } from "antd";
import { useRef, useEffect } from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

export default function MovieShare(props) {
  const inputRef = useRef(null);
  const handleSharingAction = async () => {
    const shareData = {
      authorId: props.userToken.id,
      text: inputRef.current.input.value,
      movieID: props.movie.id,
    };
    console.log(shareData);

    const requestDataJsonString = JSON.stringify(shareData);

    const response = await fetch("/api/sharemovie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestDataJsonString,
    });

    // Handle the response here
    if (response.ok) {
      // Process successful response
    } else {
      // Handle error
    }
  };
  return (
    <div className="main_share_card">
      <div className="navTitle">
        <PeopleOutlineIcon color="white" className="shareIcon" />
        <div className="title">
          {props.movie.title ? (
            <h3>{props.movie.title}</h3>
          ) : (
            <h3>{props.movie.name}</h3>
          )}
          <div className="footTitle">Public access</div>
        </div>
      </div>
      <div className="inputFrame">
        <Input
          placeholder="Write something about your post..."
          variant="borderless"
          className="input"
          ref={inputRef}
        />
        <Button
          type="primary"
          className="shareButton"
          onClick={() => {
            handleSharingAction();
            props.close();
          }}
        >
          Share
        </Button>
      </div>
    </div>
  );
}
