import React, { useEffect } from 'react'
import styles from "./dashboardSidebar.module.scss"
import { NavLink, useNavigate } from 'react-router-dom';

function DashboardSidebar(props) {
  const navigate = useNavigate()

  const logout = () => {

    props.setContext({
      socket: null,
      isConnected: false,
      user: null
    })
    
    localStorage.removeItem('token');
    navigate("/login")
  }
  useEffect(() => {
    if (props.sidebarOpen) {
      document.getElementsByClassName(styles.sidebar)[0].classList.remove(styles.closeMenu)
    } else {
      document.getElementsByClassName(styles.sidebar)[0].classList.add(styles.closeMenu)
    }

  }, [props.sidebarOpen])

  const menuHandler = () => {
    if (window.innerWidth < 575) {
      props.setSidebarOpen(false)
    }
  }

  return (
    <>
      <div className={styles.sidebar}>
        <div>
          <NavLink to='/dashboard'><h1 className={styles.gradiant} onClick={menuHandler}>KOOLOC</h1></NavLink>
          <ul className={styles.listGroup}>
            <li onClick={menuHandler} className={styles.listItem}><NavLink end className={styles.link} to="expenses"><i className="fa-solid fa-money-bill mr-10"></i><span>Depenses</span></NavLink></li>
            <li onClick={menuHandler} className={styles.listItem}><NavLink end className={styles.link} to="shoppinglist"><i className="fa-solid fa-cart-shopping mr-10"></i><span>Listes de course</span></NavLink></li>
            <li onClick={menuHandler} className={styles.listItem}><NavLink end className={styles.link} to="chat"><i className="fa-solid fa-comments mr-10"></i><span>Chat</span></NavLink></li>
            <li onClick={menuHandler} className={styles.listItem}><NavLink end className={styles.link} to="agenda"><i className="fa-solid fa-calendar mr-10"></i><span>Agenda</span></NavLink></li>
            <li onClick={menuHandler} className={styles.listItem}><NavLink end className={styles.link} to="documents"><i className="fa-solid fa-file mr-10"></i><span>Documents</span></NavLink></li>
            <li onClick={menuHandler} className={styles.listItem}><NavLink end className={styles.link} to="polls"><i className="fa-solid fa-square-poll-horizontal mr-10"></i><span>Sondage</span></NavLink></li>
            <li onClick={menuHandler} className={styles.listItem}><NavLink end className={styles.link} to="reports"><i className="fa-solid fa-flag mr-10"></i><span>Report</span></NavLink></li>
          </ul>
        </div>
        <span className={styles.logout} onClick={logout}><i className="fa-solid fa-power-off"></i> Deconnexion</span>
      </div>
    </>
  )
}

export default DashboardSidebar