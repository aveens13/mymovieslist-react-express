import { Link } from "react-router-dom";

export default function Landingpage() {
  return (
    <>
      <div className="main--hero">
        <button>
          <Link to="/signup">Signup</Link>
        </button>
        <button>
          <Link to="/login">Login</Link>
        </button>
      </div>
    </>
  );
}
