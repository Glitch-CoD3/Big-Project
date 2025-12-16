import React, { use } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const RefreshHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(({setIsToken}) => {
        if (localStorage.getItem('refresh')) {
            setIsToken(true);
            if(location.pathname==='/home' || location.pathname === "/login" || 
                location.pathname === "/signup"
            ){
                navigate("/home", {replace : false});
            }

        }
    }, [location, navigate, setIsToken]);

  return (
    null
  )
}
