import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

export const RefreshHandler = ({setIsAuthenticated}) => {
    const location = useLocation();
    const navigate = useNavigate();
// utils/RefreshHandler.jsx
useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const path = location.pathname;

    if (token) {
        setIsAuthenticated(true);
        // Only redirect IF we are specifically on an auth page
        if (path === "/" || path.toLowerCase() === "/login" || path.toLowerCase() === "/signup") {
            navigate("/home", { replace: true });
        }
    } else {
        setIsAuthenticated(false);
    }
}, [location.pathname]); // Only watch the path change

  return (
    null
  )
}
