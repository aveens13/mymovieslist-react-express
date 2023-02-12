import { useState, useEffect, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { AppContext } from "../context";
// const userContext = createContext();
function Component1() {
  const user = useContext(AppContext);
  console.log(user);
  return (
    <>
      <h1>{`Hello ${user}!`}</h1>
      <Component2 />
    </>
  );
}

function Component2() {
  return (
    <>
      <h1>Component 2</h1>
      <Component3 />
    </>
  );
}

function Component3() {
  return (
    <>
      <h1>Component 3</h1>
      <Component4 />
    </>
  );
}

function Component4() {
  return (
    <>
      <h1>Component 4</h1>
      <Component5 />
    </>
  );
}

function Component5() {
  const user = useContext(AppContext);
  return (
    <>
      <h1>Component 5</h1>
      <h2>{`Hello ${user} again!`}</h2>
    </>
  );
}

export default Component1;
