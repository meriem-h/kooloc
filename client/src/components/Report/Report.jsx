import React, { useEffect, useState, useRef } from 'react'
import ReportBox from './ReportBox/ReportBox'
import ReportSidebar from './ReportSidebar/ReportSidebar'

function Report() {
    const [openSidebarMenu, setOpenSidebarMenu] = useState(true)

    let sidebarRef = useRef(null)
    let boxRef = useRef(null)

    useEffect(() => {
      if (!openSidebarMenu) {
        if (window.innerWidth > 975) {
          sidebarRef.current.classList.add("d-none")
          sidebarRef.current.classList.remove("flex-1")
        } else {
          sidebarRef.current.classList.add("d-none")
          boxRef.current.classList.remove("d-none")
          sidebarRef.current.classList.remove("flex-1")
        }
      } else {
        if (window.innerWidth > 975) {
          sidebarRef.current.classList.remove("d-none")
          sidebarRef.current.classList.remove("flex-1")
        } else {
          sidebarRef.current.classList.remove("d-none")
          sidebarRef.current.classList.add("flex-1")
          boxRef.current.classList.add("d-none")
        }
      }
    }, [openSidebarMenu])
  
    useEffect(() => {
      if(window.innerWidth < 975) {
        setOpenSidebarMenu(true)
      }
    }, [])
  
  
    window.onresize = () => {
      if (window.innerWidth > 975) {
        setOpenSidebarMenu(true)
      } else {
        setOpenSidebarMenu(false)
      }
    };
    return (
        <div className='content-page'>
            <ReportSidebar openSidebarMenu={openSidebarMenu} sidebarRef={sidebarRef} setOpenSidebarMenu={setOpenSidebarMenu} />
            <ReportBox setOpenSidebarMenu={setOpenSidebarMenu} boxRef={boxRef} openSidebarMenu={openSidebarMenu} />
        </div>
    )
}

export default Report