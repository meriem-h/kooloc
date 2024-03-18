import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import styles from './Login.module.scss'


function Login() {

  const [context, setContext] = useOutletContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate();

  const handleSubmit = event => {
    if(context.socket){

      event.preventDefault();
      fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "OK") {
            localStorage.setItem('token', data.response.token);
            const authSocket = context.socket;
            authSocket.auth = {token:data.response.token}
            console.log(data)
            setContext({
              ...context,
              socket:authSocket,
              isConnected:true,
              user:data.response.user
            })
            return navigate('/dashboard')
          }
        })
        .catch(error => console.error(error))
    }
   
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="pageContainer">
      <div>
        <p className='bigTitle mb-20'>Home sweet home !</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input id='email' type="email" name='email' value={formData.email} onChange={handleInputChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">Mot de passe</label>
          <input id='password' type="password" name='password' value={formData.password} onChange={handleInputChange} />
        </div>
        <div className='d-flex justify-content-center'>
          <button className='btn btn-primary'>Entrer <i className="fa-solid fa-arrow-right"></i></button>
        </div>
      </form>
    </div>
  )
}

export default Login