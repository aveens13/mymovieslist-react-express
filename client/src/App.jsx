import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import List from "./pages/Movielist/List";
import NavBar from "./pages/Navbar";
import Movie from "./pages/Movie";
import Signup from "./pages/Signup";
import Shows from "./pages/Shows";
import Profile from "./pages/Profile";
import Broadcast from "./pages/Broadcast";
import Login from "./pages/Login";
import Landingpage from "./Landingpage";
import { MovieDetails } from "./pages/Moviedetails";
import Loader from "./pages/Loader";
const customToastId = "preventingDuplicate";

function App() {
  const [state, setState] = useState("waiting");
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);

  //check if the user is already logged in or not
  //run this useeffect hook on every time the state is changed
  useEffect(() => {
    fetch("/api/verifyToken").then((result) => {
      if (result.ok) {
        result.json().then((e) => {
          setState("verified");
          setResponse(e);
          setLoading(false);
          if (!toast.isActive(customToastId)) {
            toast.success("Logged In Successfully", {
              toastId: customToastId,
            });
          }
        });
      } else {
        setLoading(false);
      }
    });
  }, [state]);

  //handle the search query click
  const handleClick = (result) => {
    console.log(result.id);
  };
  //If user is verified then user can be redirected to following routes
  if (state === "verified") {
    return (
      <>
        <BrowserRouter>
          <NavBar
            changeState={() => setState("waiting")}
            queryClick={handleClick}
          />
          <ToastContainer
            autoClose={1000}
            hideProgressBar={true}
            theme="dark"
            position="bottom-left"
            transition={Slide}
          />
          <Routes>
            <Route path="/" element={<Home userToken={response?.data} />} />
            <Route path="/list" element={<List userToken={response?.data} />} />
            <Route
              path="/movies"
              element={<Movie userToken={response?.data} />}
            />
            <Route
              path="/details/:id/:type"
              element={<MovieDetails userToken={response?.data} />}
            />
            <Route
              path="/tv-shows"
              element={<Shows userToken={response?.data} />}
            />
            <Route
              path="/profile"
              element={
                <Profile
                  userName={response?.userName}
                  userToken={response?.data}
                />
              }
            />
            <Route
              path="/broadcast/:streamerId"
              element={
                <Broadcast
                  userName={response.userName}
                  userToken={response.data}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </>
    );
  } else if (loading) {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Loader />} />
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
              element={
                <Signup
                  changeState={(data) => {
                    setState("verified");
                    setResponse(data);
                  }}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  changeState={(data) => {
                    setState("verified");
                    setResponse(data);
                  }}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
