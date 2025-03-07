import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import user from "../assets/user.png";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import {
  Button,
  Modal,
  DatePicker,
  Form,
  Input,
  Upload,
  Dropdown,
  message,
} from "antd";
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
  const [messageApi, contextHolder] = message.useMessage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const { TextArea } = Input;
  const key = "updatable";
  const getItems = (postId, deletePost) => [
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
      label: <span onClick={() => deletePost(postId)}>Move to bin</span>,
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

  useEffect(() => {
    fetch(`/api/posts/${userToken.id}`).then((response) => {
      response.json().then((data) => {
        console.log(data);
        setPosts(data.result);
      });
    });
  }, []);

  const deletePost = async (postId) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Deleting your post...",
      className: "custom-message",
    });
    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      await response.json().then((res) => {
        console.log(res);
        messageApi.open({
          key,
          type: "success",
          content: "Successfully Deleted!",
          duration: 2,
          className: "custom-message",
        });
      });

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.postID !== postId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getPosterUrl = (posterId) =>
    `https://image.tmdb.org/t/p/original${posterId}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <>
      {contextHolder}
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
                {follwersInfo.count}{" "}
                <span className="username-profile">followers</span>
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
          {posts.map((post) => (
            <div className="profile-fetched-post" key={post.postID}>
              <div className="title-profile-post-section">
                <img src={user} alt="Profile Picture" />
                <div className="profile-post-user-info">
                  <span className="username-profile">
                    @aveens shares his thoughts on watching {post.content.title}
                  </span>
                  <div className="user-name-time-post">
                    <span className="name-profile">{userName}</span>
                    <span className="time-post-profile">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
                <Dropdown
                  menu={{
                    items: getItems(post.postID, deletePost),
                  }}
                  trigger={["click"]}
                >
                  <MoreVertRoundedIcon className="profile-post-options" />
                </Dropdown>
              </div>
              <div className="desc-profile-post-section">
                {post.description}
              </div>
              <div className="post-image-section-profile">
                <img
                  loading="lazy"
                  src={getPosterUrl(
                    post.content.backdrop_path || post.content.poster_path
                  )}
                  alt="Post Image"
                />
              </div>
            </div>
          ))}
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
            backgroundColor: "transparent", // Dark background
            padding: "1.5rem",
            borderRadius: "8px",
            alignItems: "center",
          }}
          initialValues={{
            name: userName,
            username: userName + "567",
            bio: "I love watching movies 🍿 with genre thriller and comedy in general. Lets connect! ❤️",
          }}
        >
          <Form.Item name="name">
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

          <Form.Item name="username">
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

          <Form.Item name="bio">
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
