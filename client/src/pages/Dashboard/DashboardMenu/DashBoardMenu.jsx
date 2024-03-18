import React, { useEffect, useState } from 'react'
import styles from './dashboardMenu.module.scss'
import { useOutletContext } from "react-router-dom";

import LoginButton from '../../../components/LoginButton/LoginButton'

function DashBoardMenu(props) {

  const [context, setContext] = useOutletContext();
  const menuHandler = () => {
    props.setSidebarOpen(x => !x)
  }

  return (
    <div style={{ fontSize: "1rem" }} className={styles.dashBoardMenu}>
      <i style={{ fontSize: "1.50rem", cursor: "pointer" }} className="fa-solid fa-bars" onClick={menuHandler}></i>
      <div className='d-flex align-items-center rounded' style={{ backgroundColor: "#efefef", flex: 1, margin: "0px 50px" }}>
        <div><i className="fa-solid fa-magnifying-glass pl-10"></i></div>
        <input style={{ borderRadius: "5px", fontSize: "1rem" }} type="text" placeholder='Recherche' />
      </div>
      {context.user&&
        <LoginButton user={context?.user} />
      }
    </div>
  )
}

export default DashBoardMenu