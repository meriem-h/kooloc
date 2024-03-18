import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ProtectedRoute(props) {

    const [flag, setFlag] = useState(false)
    const navigate = useNavigate()
    const verifyToken = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/isAuth`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorisation: `BEARER ${localStorage.getItem("token")}`,
            },
        })

        if (response.ok) {
            setFlag(true);
        } else {
            localStorage.removeItem('token');
            navigate("/login")
        }
    }

    useEffect(() => {
        verifyToken();
    }, [])
    return (
        <div className='flex-1'>
            {
                flag ?
                    props.component :
                    <div className='pageContainer'><span className="loader"></span></div>
            }
        </div>
    )
}

export default ProtectedRoute