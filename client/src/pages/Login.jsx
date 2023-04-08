import { Link, useNavigate } from "react-router-dom";

export default function Login({ changeState }) {
  let navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const circulartoPlain = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(circulartoPlain);
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataJsonString,
    });
    if (response.ok) {
      console.log("ok");
      changeState();
      navigate("/");
    } else {
      const error = await response.json();
      console.log(error);
    }
  }
  return (
    <>
      <div className="login--main">
        <div className="login--card">
          <img src="" alt="" />
          <h1>Sign in</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
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
