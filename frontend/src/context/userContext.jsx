import { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [cUser, setCUser] = useState(JSON.parse(localStorage.getItem("user")));
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(cUser));
  }, [cUser]);
  return (
    <UserContext.Provider value={{ cUser, setCUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
