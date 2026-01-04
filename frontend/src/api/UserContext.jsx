// UserContext.js
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
        const innerUser = outer.user || outer; 
        
        console.log("Parsed user data:", innerUser);
        
        setUser({
          userId: innerUser._id || innerUser.id || null,
          username: innerUser.username || "",
          fullName: innerUser.fullName || "",
          avatar: innerUser.avatar || null,
          email: innerUser.email || ""
        });
      } catch (err) {
        console.error("Failed to parse user session", err);
      }
    } else {
      console.log("No user found in localStorage");
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
    setUser({ userId: null, username: "", fullName: "", avatar: null, email: "" });
    localStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Make sure this export is correct
export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};