import React, { useState, useRef, useEffect } from 'react'
import styles from "./createorjoinhouse.module.scss"
import { useNavigate, useOutletContext } from "react-router-dom";



function CreateOrJoinHouse() {

  const [name, setName] = useState()
  const [uui, setUui] = useState()

  const [context, setContext] = useOutletContext();
  useEffect(() => {
    if (context && context.user.houseShareId != null) {
      navigate("/dashboard")
    }
    console.log(context)
  }, [context])

  const refname = useRef(null);
  const refuuid = useRef(null);

  const navigate = useNavigate()

  const submitHandler = async (ref, url) => {
    const data = ref.current.value
    let response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        authorisation: `BEARER ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ "data": data })
    })

    if (response.status === 200) {
      let data = await response.json()
      let authSocket = context.socket
      authSocket.token = data.token
      setContext({ ...context, user: data.user, socket: authSocket })
      localStorage.setItem('token', data.token)
    }

    if (response.status === 403) {
      localStorage.removeItem('token');
      setContext({
        ...context,
        isConnected: false,
        user: null
      })
      navigate('/login')
    }
  }




  return (
    <div className='pageContainer'>
      <div className={styles.houseContainer}>
        <div className={`${styles.gradiant1} ${styles.card}`}>
          <p className=''><strong>Rejoins une Koolocation en entrant son code</strong></p>
          <div className='d-flex'>
            <input ref={refname} type="text" placeholder='ddeb27fb-d9a0-4624-be4d-4615062daed4' />
            <button onClick={() => submitHandler(refname, `${process.env.REACT_APP_BACKEND_URL}/house/join`)} className='btn btn-primary'><i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
        <div className={`${styles.gradiant2} ${styles.card}`}>
          <p className=''><strong>Crée ta koolocation en lui choisissant son nom !</strong></p>
          <div className='d-flex'>
            <input ref={refuuid} type="text" placeholder='ex: Bienvenue a Wonderland' />
            <button onClick={() => submitHandler(refuuid, `${process.env.REACT_APP_BACKEND_URL}/house/create`)} className='btn btn-primary'><i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOrJoinHouse