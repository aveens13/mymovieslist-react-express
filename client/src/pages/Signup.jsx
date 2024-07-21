import { Link, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { Modal, Input, notification } from "antd";

export default function Signup(props) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback(
    (errorTitle, errorDesc) => {
      api["error"]({
        message: errorTitle,
        description: errorDesc,
        showProgress: true,
      });
    },
    [api]
  );

  let navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const circulartoPlain = Object.fromEntries(formData.entries());
    setFormData(circulartoPlain);
    const formDataJsonString = JSON.stringify(circulartoPlain);
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataJsonString,
    });
    if (response.ok) {
      setOpen(true);
    } else {
      openNotification(
        "Error",
        "Error Server Side while sending otp. Try using a valid email or wait for server to respond. Thank you for your patience"
      );
    }
  }
  const handleOk = async () => {
    setConfirmLoading(true);
    const formDataJsonString = JSON.stringify(formData);
    const response = await fetch("/api/validateOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataJsonString,
    });
    if (response.ok) {
      setConfirmLoading(false);
      setOpen(false);
      const tokenResponse = await fetch("/api/verifyToken");
      if (tokenResponse.ok) {
        const userData = await tokenResponse.json();
        props.changeState(userData);
        navigate("/");
      }
    } else {
      setConfirmLoading(false);
      tokenResponse.json().then((e) => {
        openNotification("Error", e.result);
      });
    }
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const onChange = (text) => {
    console.log("onChange:", text);
    setFormData((prevData) => ({
      ...prevData,
      otp: text,
    }));
  };

  return (
    <div className="hero--card">
      {contextHolder}
      <div className="left--content">
        <div className="labelElement">
          <label>One Place for all your movies</label>
          <p>
            Create an account with us to manage your own list of movies and
            share it with your friends.
          </p>
        </div>
        <div className="labelElement">
          <label>Ratings</label>
          <p>Rate your personal favourite movies</p>
        </div>
        <div className="labelElement">
          <label>Recommendations</label>
          <p>Discover shows and movies you might love</p>
        </div>
      </div>
      <div className="right--content">
        <div className="label--text">
          <h1>Create an account</h1>
          <p>Let's get started to the bucket for your movies</p>
        </div>
        <div className="form--hero">
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" />
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <input type="submit" value="Create account" />
          </form>
        </div>
        <div className="bottom--hero">
          <p className="grey">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <Modal
        title="Verify your email"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        onOk={handleOk}
        style={{
          backgroundColor: "black",
          fontFamily: "Poppins",
        }}
      >
        We have sent you a 6 digit verification code on your email. Please
        consider looking in spam as well.
        <br />
        <br />
        <br />
        <Input.OTP length={6} onChange={onChange} />
      </Modal>
    </div>
  );
}
