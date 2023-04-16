import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ changeState }) {
  const [error, setError] = useState({
    email: false,
    password: false,
  });
  let navigate = useNavigate();
  async function handleSubmit(event) {
    setError({ email: false, password: false });
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const circulartoPlain = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(circulartoPlain);
    const response = await toast.promise(
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formDataJsonString,
      }),
      {
        pending: "Signing in",
      }
    );
    if (response.ok) {
      changeState();
      navigate("/");
    } else {
      const error = await response.json();

      //checking the type of the error
      if (error.status == "emailerror") {
        setError((prev) => {
          return { ...prev, email: true };
        });
      } else {
        setError((prev) => {
          return { ...prev, password: true };
        });
      }
    }
  }
  return (
    <>
      <div className="login--main">
        <div className="login--card">
          <img src="" alt="" />
          <ToastContainer
            position="top-center"
            hideProgressBar="true"
            className={"toast"}
            closeButton={false}
            transition={Zoom}
            theme="dark"
          />
          <h1>Sign in</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" />
            <p className={error.email ? "error" : "noError"}>
              * Please enter a valid email
            </p>
            <input type="password" name="password" placeholder="Password" />
            <p className={error.password ? "error" : "noError"}>
              * Incorrect Password
            </p>
            <input type="submit" value="Sign in" />
          </form>
          <p className="grey">Forgot your password?</p>
          <h6>Dont have a Movieridge's account yet?</h6>
          <button>
            <Link to="/signup">Create new account</Link>
          </button>
        </div>
      </div>
    </>
  );
}
