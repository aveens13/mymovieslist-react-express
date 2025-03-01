import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import user from "../assets/user.png";
import {
  Button,
  Modal,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import "../styles/profile.css";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import EditIcon from "@mui/icons-material/Edit";

export default function Profile({ userName, userToken }) {
  const [follwersInfo, setFollowersInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
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
                <span className="name-profile">Avinav Bhattarai</span>
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
        <div className="mid-hero-profile">Mid</div>
        <div className="right-hero-profile">right</div>
      </div>
      <Modal
        title="Edit your profile"
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            // loading={loading}
            style={{
              backgroundColor: "#e50914",
            }}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
            <Checkbox>Checkbox</Checkbox>
          </Form.Item>
          <Form.Item label="Radio">
            <Radio.Group>
              <Radio value="apple"> Apple </Radio>
              <Radio value="pear"> Pear </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Input">
            <Input />
          </Form.Item>
          <Form.Item label="Select">
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="TreeSelect">
            <TreeSelect
              treeData={[
                {
                  title: "Light",
                  value: "light",
                  children: [
                    {
                      title: "Bamboo",
                      value: "bamboo",
                    },
                  ],
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Cascader">
            <Cascader
              options={[
                {
                  value: "zhejiang",
                  label: "Zhejiang",
                  children: [
                    {
                      value: "hangzhou",
                      label: "Hangzhou",
                    },
                  ],
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="DatePicker">
            <DatePicker />
          </Form.Item>
          <Form.Item label="RangePicker">
            <RangePicker />
          </Form.Item>
          <Form.Item label="InputNumber">
            <InputNumber />
          </Form.Item>
          <Form.Item label="TextArea">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Switch" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload action="/upload.do" listType="picture-card">
              <button
                style={{
                  color: "inherit",
                  cursor: "inherit",
                  border: 0,
                  background: "none",
                }}
                type="button"
              >
                <AddBoxOutlinedIcon />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item label="Button">
            <Button>Button</Button>
          </Form.Item>
          <Form.Item label="Slider">
            <Slider />
          </Form.Item>
          <Form.Item label="ColorPicker">
            <ColorPicker />
          </Form.Item>
          <Form.Item label="Rate">
            <Rate />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
