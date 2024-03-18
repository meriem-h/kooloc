import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import ProfilBox from './ProfilBox/ProfilBox';
import ProfilSidebar from './ProfilSidebar/ProfilSidebar';

export default function Profil(){
  const [openSidebarMenu, setOpenSidebarMenu] = useState(true)
  // eslint-disable-next-line
  const [context, setContext] = useOutletContext();

  const [selectedUserId, setSelectedUserId] = useState(null);

  const getUserId = (e) => {
    const id = +e.target.id
    setSelectedUserId(id)
  }

  let sidebarRef = useRef(null)
  let boxRef = useRef(null)

  useEffect(() => {
    if (!openSidebarMenu) {
      if (window.innerWidth > 975) {
        sidebarRef.current?.classList.add("d-none")
        sidebarRef.current?.classList.remove("flex-1")
      } else {
        sidebarRef.current?.classList.add("d-none")
        boxRef.current?.classList.remove("d-none")
        sidebarRef.current?.classList.remove("flex-1")
      }
    } else {
      if (window.innerWidth > 975) {
        sidebarRef.current?.classList.remove("d-none")
        sidebarRef.current?.classList.remove("flex-1")
      } else {
        sidebarRef.current?.classList.remove("d-none")
        sidebarRef.current?.classList.add("flex-1")
        boxRef.current?.classList.add("d-none")
      }
    }
  }, [openSidebarMenu])

  useEffect(() => {
    if (window.innerWidth < 975) {
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
      <ProfilSidebar 
        getUserId={getUserId}
        userList={context.user?.houseShare?.users}
        openSidebarMenu={openSidebarMenu}
        setOpenSidebarMenu={setOpenSidebarMenu}
        sidebarRef={sidebarRef}
      
      />
 
        <ProfilBox 
          setOpenSidebarMenu={setOpenSidebarMenu}
          boxRef={boxRef}
          openSidebarMenu={openSidebarMenu}
          house={(selectedUserId > 0) ? false : true}
          selectedUserId={selectedUserId}
        />

    </div>
  )
}