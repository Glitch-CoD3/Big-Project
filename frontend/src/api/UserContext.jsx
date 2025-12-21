import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null,
    username: "",
    fullName: "",
    avatar: null,
    email: ""
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const outer = JSON.parse(userStr);
        // Safely extract the inner user object
        const innerUser = outer.user || outer; 
        
        setUser({
          userId: innerUser._id || innerUser.id, // Handle different DB naming
          username: innerUser.username || "",
          fullName: innerUser.fullName || "",
          avatar: innerUser.avatar || null,
          email: innerUser.email || ""
        });
      } catch (err) {
        console.error("Failed to parse user session", err);
      }
    }
  }, []);

  const login = (userData) => {
    const inner = userData.user || userData;
    setUser({
      userId: inner._id || inner.id,
      username: inner.username,
      fullName: inner.fullName,
      avatar: inner.avatar,
      email: inner.email
    });
  };

  const logout = () => {
    setUser({ userId: null, username: "", fullName: "", avatar: null });
    localStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);