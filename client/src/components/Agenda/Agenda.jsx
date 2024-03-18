import React, { useEffect, useState, useRef } from 'react'
import AgendaBox from './AgendaBox/AgendaBox'
import AgendaSidebar from './AgendaSidebar/AgendaSidebar'
import { useOutletContext, useParams } from "react-router-dom";

function Agenda() {
  const [openSidebarMenu, setOpenSidebarMenu] = useState(true)
  const [context, setContext] = useOutletContext();
  const [data, setData] = useState();
  const [date, setDate] = useState();
  const [schedule, setSchedule] = useState([])
  const [openCreate, setOpenCreate] = useState(false)
  const [id, setId] = useState()
  


  let sidebarRef = useRef(null)
  let boxRef = useRef(null)
  let today = new Date().toISOString().substring(0, 10)
  let filter


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
    if (window.innerWidth < 975) {
      setOpenSidebarMenu(true)
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/event`, {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        authorisation: `BEARER ${localStorage.getItem("token")}`
      },
    })
      .then(res => res.json())
      .then(res => (
        setSchedule(res),
        (
          filter = res.data.filter((obj) => (today >= obj.start && today <= obj.end) || obj.start == today),
          
          setData(filter)
        )
      ))
      .catch(error => console.error(error))
  }, [])



  function handleData(dataFromBox) {
    setData(dataFromBox);
  }

  function handleDate(dateFromBox) {
    setDate(dateFromBox);
  }

  function handleCreate(createMenue) {
    setOpenCreate(createMenue);
  }

  const handleDelete = (id) => {
    setId(id)
  }




  window.onresize = () => {
    if (window.innerWidth > 975) {
      setOpenSidebarMenu(true)
    } else {
      setOpenSidebarMenu(false)
    }
  };
  return (
    <div className='content-page'>
      <AgendaSidebar context={context} data={data} date={date} onCreate={handleCreate} onDelete={handleDelete} openSidebarMenu={openSidebarMenu} sidebarRef={sidebarRef} setOpenSidebarMenu={setOpenSidebarMenu} />
      <AgendaBox context={context} Create={openCreate} Delete={id} onClose={handleCreate} onData={handleData} onDate={handleDate}  data={schedule} setOpenSidebarMenu={setOpenSidebarMenu} boxRef={boxRef} openSidebarMenu={openSidebarMenu} />
    </div>
  )
}

export default Agenda