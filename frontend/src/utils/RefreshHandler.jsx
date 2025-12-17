import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

export const RefreshHandler = ({setIsAuthenticated}) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            setIsAuthenticated(true);
            if(location.pathname==='/' || location.pathname === "/login" || location.pathname === "/Signup"
            ){
                navigate("/home", {replace : false});
            }

        }
    }, [location, navigate, setIsAuthenticated]);

  return (
    null
  )
}
