import { Link, useNavigate } from "react-router-dom";
export default function Signup(props) {
  let navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const circulartoPlain = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(circulartoPlain);
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataJsonString,
    });
    if (response.ok) {
      console.log("ok");
      props.changeState();
      navigate("/");
    }
  }
  return (
    <div className="hero--card">
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
    </div>
  );
}
