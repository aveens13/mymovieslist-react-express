import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import List from "./pages/Movielist/List";
import NavBar from "./pages/Navbar";
import Movie from "./pages/Movie";
import Signup from "./pages/Signup";
import Shows from "./pages/Shows";
import Login from "./pages/Login";
import Landingpage from "./Landingpage";
function App() {
  const [state, setState] = useState("waiting");
  const [response, setResponse] = useState({});

  //check if the user is already logged in or not
  useEffect(() => {
    fetch("/api/verifyToken").then((result) => {
      if (result.ok) {
        result.json().then((e) => {
          setState("verified");
          setResponse(e.data);
        });
      }
    });
  }, []);

  //If user is verified then user can be redirected to following routes
  if (state == "verified") {
    return (
      <>
        <BrowserRouter>
          <NavBar changeState={() => setState("waiting")} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<List userToken={response} />} />
            <Route path="/movies" element={<Movie userToken={response} />} />
            <Route path="/tv-shows" element={<Shows />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  } else {
    //else he can be redirected to landing page
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landingpage />} />
            <Route
              path="/signup"
              element={<Signup changeState={() => setState("verified")} />}
            />
            <Route
              path="/login"
              element={<Login changeState={() => setState("verified")} />}
            />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
