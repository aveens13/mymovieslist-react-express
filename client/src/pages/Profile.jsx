import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import user from "../assets/user.png";
import post from "../assets/details.png";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Button, Modal, DatePicker, Form, Input, Upload, Dropdown } from "antd";
import "../styles/profile.css";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import EditIcon from "@mui/icons-material/Edit";
import {
  DeleteOutlined,
  EditOutlined,
  CommentOutlined,
} from "@ant-design/icons";

export default function Profile({ userName, userToken }) {
  const [follwersInfo, setFollowersInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const { TextArea } = Input;
  const items = [
    {
      key: "2",
      label: <span>Turn off comments for this post</span>,
      icon: <CommentOutlined />,
    },
    {
      key: "3",
      label: <span>Edit post</span>,
      icon: <EditOutlined />,
    },
    {
      key: "4",
      label: "Move to bin",
      danger: true,
      icon: <DeleteOutlined />,
    },
  ];

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  useEffect(() => {
    fetch(`/api/followers/${userToken.id}`).then((response) => {
      response.json().then((data) => {
        setFollowersInfo(data);
      });
    });
  }, []);
  return (
    <>
      <div className="main_profile">
        <div className="left-hero-profile">
          <div className="profile-card-hero-main">
            <div className="picture-name-user">
              <img src={user} alt="Profile Picture" />
              <div className="name-user-hero">
                <span className="name-profile">{userName}</span>
                <span className="username-profile">@aveens</span>
              </div>
              <Button
                color="default"
                variant="text"
                style={{
                  backgroundColor: "rgba(30, 30, 30, 255)",
                  color: "white",
                  border: "none",
                  // marginLeft: "1rem",
                }}
                className="edit-button-profile"
                onClick={() => setModal2Open(!modal2Open)}
              >
                <EditIcon fontSize="small" />
                Edit Profile
              </Button>
            </div>
            <div className="user-following-stat">
              <span>
                1700 <span className="username-profile">followers</span>
              </span>
              <span>
                569 <span className="username-profile">following</span>
              </span>
            </div>
            <div className="user-description-profile">
              <span className="descrip-profile">
                I love watching movies 🍿 with genre thriller and comedy in
                general. Lets connect! ❤️
              </span>
            </div>
            <Button
              type="text"
              className="followbutton-profile"
              style={{
                color: "white",
                backgroundColor: "#e50914",
                width: "50%",
              }}
              loading={loading}
              onClick={() => setLoading(!loading)}
            >
              Follow
            </Button>
          </div>
          <div className="genre-classifier-profile">
            <span>Preferred Genres</span>
            <div className="genre-titles">
              <span>Thriller</span>
              <span>Suspense</span>
              <span>Comedy</span>
              <span>Horror</span>
            </div>
          </div>
          <div className="communities-profile">
            <div className="com-title-profile">
              <span>Communities</span>
              <AddBoxOutlinedIcon
                fontSize="medium"
                className="add-outline-com-profile"
              />
            </div>
            <div className="communities-list-profile">
              <div className="community">
                <span>#com-nepali</span>
                <span className="username-profile">462 members</span>
              </div>
              <div className="community">
                <span>#horrormovies</span>
                <span className="username-profile">462 members</span>
              </div>
              <div className="community">
                <span>#romcom-group</span>
                <span className="username-profile">462 members</span>
              </div>
              <div className="community">
                <span>#thriller-posting</span>
                <span className="username-profile">462 members</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mid-hero-profile">
          <div className="profile-fetched-post">
            <div className="title-profile-post-section">
              <img src={user} alt="Profile Picture" />
              <div className="profile-post-user-info">
                <span className="username-profile">@aveens</span>
                <div className="user-name-time-post">
                  <span className="name-profile">Avinav Bhattarai</span>
                  <span className="time-post-profile">1hr ago</span>
                </div>
              </div>
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
              >
                <MoreVertRoundedIcon className="profile-post-options" />
              </Dropdown>
            </div>
            <div className="desc-profile-post-section">
              Recently I watched this movie, worth giving it a shot 🎥🎥
            </div>
            <div className="post-image-section-profile">
              <img src={post} alt="Post Image" />
            </div>
          </div>
          <div className="profile-fetched-post">
            <div className="title-profile-post-section">
              <img src={user} alt="Profile Picture" />
              <div className="profile-post-user-info">
                <span className="username-profile">@aveens</span>
                <div className="user-name-time-post">
                  <span className="name-profile">Avinav Bhattarai</span>
                  <span className="time-post-profile">1hr ago</span>
                </div>
              </div>
              <MoreVertRoundedIcon className="profile-post-options" />
            </div>
            <div className="desc-profile-post-section">
              Recently I watched this movie, worth giving it a shot 🎥🎥
            </div>
            <div className="post-image-section-profile">
              <img src={post} alt="Post Image" />
            </div>
          </div>
          <div className="profile-fetched-post">
            <div className="title-profile-post-section">
              <img src={user} alt="Profile Picture" />
              <div className="profile-post-user-info">
                <span className="username-profile">@aveens</span>
                <div className="user-name-time-post">
                  <span className="name-profile">Avinav Bhattarai</span>
                  <span className="time-post-profile">1hr ago</span>
                </div>
              </div>
              <MoreVertRoundedIcon className="profile-post-options" />
            </div>
            <div className="desc-profile-post-section">
              Recently I watched this movie, worth giving it a shot 🎥🎥
            </div>
            <div className="post-image-section-profile">
              <img src={post} alt="Post Image" />
            </div>
          </div>
        </div>
        <div className="right-hero-profile">right</div>
      </div>
      <Modal
        title="Edit your profile"
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{
            maxWidth: 600,
            backgroundColor: "#121212", // Dark background
            padding: "1.5rem",
            borderRadius: "8px",
            alignItems: "center",
          }}
          centered
        >
          <Form.Item>
            <Input
              style={{
                backgroundColor: "#1E1E1E",
                color: "white",
                border: "1px solid #333",
              }}
              placeholder="Avinav Bhattarai"
              className="custom-placeholder"
            />
          </Form.Item>

          <Form.Item>
            <Input
              style={{
                backgroundColor: "#1E1E1E",
                color: "white",
                border: "1px solid #333",
              }}
              placeholder="aveens"
              className="custom-placeholder"
            />
          </Form.Item>

          <Form.Item>
            <TextArea
              rows={3}
              style={{
                backgroundColor: "#1E1E1E",
                color: "white",
                border: "1px solid #333",
              }}
              className="custom-placeholder"
              placeholder="Enter your bio"
            />
          </Form.Item>

          <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              // action="/upload.do"
              listType="picture-card"
              style={{
                backgroundColor: "#1E1E1E",
                color: "white",
                border: "1px dashed #444",
              }}
            >
              <button
                style={{
                  color: "white",
                  cursor: "pointer",
                  border: 0,
                  background: "none",
                }}
                type="button"
              >
                <div style={{ marginTop: 8 }}>Upload Profile Picture</div>
              </button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "red",
                border: "none",
                color: "white",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
