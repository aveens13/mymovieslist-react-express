import React, { useState } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState("John");

  return <AppContext.Provider value={user}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
