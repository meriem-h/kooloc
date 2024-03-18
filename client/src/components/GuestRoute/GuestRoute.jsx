import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function GuestRoute(props) {
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
            navigate("/dashboard")
        } else {
            localStorage.removeItem('token');
            setFlag(true);
        }
    }

    useEffect(() => {
        verifyToken();
    }, [])
    return (
        <div>
            {
                flag ?
                    props.component :
                    <div className='pageContainer'><span className="loader"></span></div>
            }
        </div>
    )
}
