import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom';
import styles from "./LoginButton.module.scss";

function LoginButton(props) {
  let initial = ""
  const [test,setTest] = useState(null)

  useEffect(() => {
    if (props.user) {
      // initial = props.user?.firstName[0]?.toUpperCase()
      // initial += props.user?.lastName[0]?.toUpperCase()
      // setTest(initial)
    }
  })

  return (
    <div className={styles.loginButton}>
      <Link style={{ color: '#000' }} to="/dashboard/profil"><i className="fa-solid fa-user"></i></Link>
    </div>
  )
}

export default LoginButton