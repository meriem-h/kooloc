import React from 'react'
import styles from "./reportsidebar.module.scss"

function ReportSidebar(props) {
  let sidebarRef = props.sidebarRef
  const sidebarHandler = () => {
    let setOpenSidebarMenu = props.setOpenSidebarMenu;
    let openSidebarMenu = props.openSidebarMenu;

    setOpenSidebarMenu(!openSidebarMenu)
  }
  return (
    <div ref={sidebarRef} className='sidebar-page'>
      <div className="sidebar-header">
        <i className="fa-solid fa-magnifying-glass pl-10" style={{ backgroundColor: "#efefef", height: 43 }}></i>
        <input type="text" />
        {
          window.innerWidth < 975 ?
            <i onClick={sidebarHandler} className="fa-solid fa-chevron-left ml-5" style={{ cursor: "pointer" }}></i>
            :
            ""
        }
      </div>
      <div className="sidebar-body">
      </div>
      <div className="sidebar-footer">
        <button className='btn btn-primary'>Creer un rapport<i className="fa-solid fa-square-plus ml-10"></i></button>
      </div>
    </div>
  )
}

export default ReportSidebar    