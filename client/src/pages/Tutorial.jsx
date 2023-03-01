import { useState, useEffect, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { AppContext } from "../context";
// const userContext = createContext();
function Component1() {
  const [display,setDisplay] = useState(true)
  return (
    <>
    <button onClick={()=>setDisplay(!display)}>Toggle Display</button>
    {display && <li>Hooked</li>}
    </>
  );
}


export default Component1;
