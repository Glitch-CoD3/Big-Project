import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate, Route, Routes } from "react-router-dom"
import Home from './Pages/Home/Home.jsx'
import SignUp from './Pages/SignUp.jsx'
import Login from './Pages/Login.jsx'
import { RefreshHandler } from './utils/RefreshHandler.jsx'

function App() {

  //   useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/v1/users/register");
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   getData();
  // }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <>
      <RefreshHandler
        setIsAuthenticated={setIsAuthenticated}
        setAuthChecked={setAuthChecked}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </>
  );
}

export default App
