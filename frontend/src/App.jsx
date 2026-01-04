import './App.css'
import { useState } from 'react'
import { Navigate, Route, Routes } from "react-router-dom"
import Home from './Pages/Home/Home.jsx'
import SignUp from './Pages/SignUp.jsx'
import Login from './Pages/Login.jsx'
import UploadVideo from './Pages/UploadVideo/UploadVideo.jsx'
import { RefreshHandler } from './utils/RefreshHandler.jsx'
import Watch from './Pages/VideoWatch.jsx'
import { Header } from './Components/Header.jsx'
import setSidebarOpen from "./Pages/Home/Home.jsx"
import Dashboard from './Pages/DetailsPage.jsx'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // PrivateRoute wrapper for authentication
  const PrivateRoute = ({ element }) => {
  const hasToken = !!localStorage.getItem('accessToken');
  // Use the token directly for the check to avoid waiting for state sync
  return hasToken ? element : <Navigate to="/login" replace />;
}

  // Layout wrapper: Header always visible
  const LayoutWithHeader = ({ children }) => (
    <>
      <Header
        className="fixed top-0 left-0 w-full z-50"
        onToggleSidebar={() => setSidebarOpen(true)}
      />
      <div className="pt-14">{children}</div> {/* content pushed below header */}
    </>
  )

  return (
    <>
      <RefreshHandler
        setIsAuthenticated={setIsAuthenticated}
        setAuthChecked={setAuthChecked}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Pages with persistent header */}
        <Route
          path="/home"
          element={
            <PrivateRoute
              element={
                <LayoutWithHeader>
                  <Home />
                </LayoutWithHeader>
              }
            />
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute
              element={
                <LayoutWithHeader>
                  <UploadVideo />
                </LayoutWithHeader>
              }
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={
                <LayoutWithHeader>
                  <Dashboard />
                </LayoutWithHeader>
              }
            />
          }
        />
        <Route
          path="/watch/:videoId"
          element={
            <PrivateRoute
              element={
                <LayoutWithHeader>
                  <Watch />
                </LayoutWithHeader>
              }
            />
          }
        />

        {/* Pages without header */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
