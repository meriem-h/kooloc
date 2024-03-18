import React, { useRef, useEffect } from 'react'
import styles from "./reportbox.module.scss"

function ReportBox(props) {
  let boxRef = props.boxRef

  const sidebarMenuHandler = () => {
    let setOpenSidebarMenu = props.setOpenSidebarMenu;
    let openSidebarMenu = props.openSidebarMenu;

    setOpenSidebarMenu(!openSidebarMenu)
  }

  const iconRef = useRef(null)
  useEffect(() => {
    if (props.openChatMenu) {
      iconRef.current.className = "fa-solid fa-chevron-right mr-10"
    } else {
      iconRef.current.className = "fa-solid fa-chevron-left mr-10"
    }
  })

  return (
    <div ref={boxRef} className='box-page'>
      <div className="box-header">
        <div className='box-back' onClick={sidebarMenuHandler}><i ref={iconRef} className="fa-solid fa-chevron-right mr-10" style={{ cursor: "pointer" }}></i>Rapport</div>
      </div>
      <div className="box-body">cedric</div>
      <div className="box-footer">cedric</div>
    </div>
  )
}

export default ReportBox