import "../styles/Home.css";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import user from "../assets/user.png";
import "../styles/Home.css";
import { Button } from "antd";
export default function Home({ userToken }) {
  const [followers, setFollowers] = useState([]);
  const [toggle, setToggle] = useState(false);
  //Fetch followers
  useEffect(() => {
    fetch(`/api/recommededfollowers/${userToken.id}`).then((response) => {
      response.json().then((data) => {
        setFollowers(data.result);
      });
    });
  }, []);

  const toggleFollow = (id) => {
    setFollowers((prevFollowers) =>
      prevFollowers.map((follower) =>
        follower.user_id === id
          ? {
              ...follower,
              alreadyFollowed: !follower.alreadyFollowed,
              count: follower.count + 1,
            }
          : follower
      )
    );
    handleUserFollowingAction(id);
  };

  const handleUserFollowingAction = async (targetUserId) => {
    const requestData = {
      userID: userToken.id,
      targetUserID: targetUserId,
    };

    console.log(requestData);

    const requestDataJsonString = JSON.stringify(requestData);

    const response = await fetch("/api/followuser", {
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
    <>
      <div className="tophero">
        <div className="feedsection"></div>
        <div className="infoSection">
          <div className="followCard">
            {followers.map((recommended) => (
              <div className="followDialog">
                <img src={user} alt="Userimage" />
                <div className="userInfo">
                  <div className="name">{recommended.name}</div>
                  <div className="followers">{recommended.count} followers</div>
                </div>
                <div className="button">
                  {recommended.alreadyFollowed ? (
                    <Button
                      disabled
                      className="buttonDisabled"
                      key={recommended.user_id}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      className="buttonActive"
                      key={recommended.user_id}
                      onClick={() => {
                        toggleFollow(recommended.user_id);
                      }}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
