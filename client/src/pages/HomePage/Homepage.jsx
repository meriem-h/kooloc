import React from 'react'
import styles from './Homepage.module.scss'
import { Outlet, NavLink, useNavigate, useOutletContext } from "react-router-dom";
import LoginButton from "../../components/LoginButton/LoginButton.jsx";



function Homepage() {
  const [context, setContext] = useOutletContext();

  return (
    <div className={styles.homeContainer}>
      <nav className={styles.homeNavigation}>
        <div className="logo">
          <NavLink className="p-10" to="/"><h3 className={styles.gradiant}>KOOLOC</h3></NavLink>
        </div>
        <div>
          {
            !context.isConnected ?
              <ul className="d-flex align-items-center">
                <NavLink className="p-10" to="/login">Connexion</NavLink>
                <NavLink className="p-10" to="/register">Inscription</NavLink>
              </ul>
              :
              <ul className="d-flex align-items-center">
                <LoginButton user={context?.user} />
              </ul>

          }
        </div>
      </nav>
      <div className='pageContainer'>
        <Outlet context={[context, setContext]}/>
    </div>
    </div >
  )
}

export default Homepage