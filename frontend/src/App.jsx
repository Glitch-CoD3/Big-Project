import './App.css'
import { useEffect } from 'react'
import axios from 'axios'
import {Navigate, Route, Routes} from "react-router-dom"
import Home from './Pages/Home/Home.jsx'
import SignUp from './Pages/SignUp.jsx'
import Login from './Pages/Login.jsx'

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


  return (
    <>
     <Routes>
      <Route path="/" element= {<Navigate to='/login'/>}  />
      <Route path="/home" element= {<Home />}  />
      <Route path="/signup" element= {<SignUp />}  />
      <Route path="/login" element= {<Login />}  />
     </Routes>
    </>
  )
}

export default App
