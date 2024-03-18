import React, { useState, useRef, useEffect } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import frLocale from '@fullcalendar/core/locales/fr';

import styles from './agendabox.module.scss'

function AgendaBox(props) {
  const [schedule, setSchedule] = useState([])
  const [openCreate, setOpenCreate] = useState()
  const [data, setData] = useState()
  const [filter, setFilter] = useState()
  const [allField, setAllField] = useState(true)


  let boxRef = props.boxRef
  let context = props.context


  useEffect(() => {
    if (props.data.data) {
      setSchedule(props.data.data)
    }
  }, [props.data.data])

  useEffect(() => {
    if (props.Create) {
      setOpenCreate(props.Create)
    }
  }, [props.Create])

  useEffect(() => {
    setSchedule(schedule.filter((obj) => obj.id !== props.Delete))
  }, [props.Delete])


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

  const createEvent = () => {
    // console.log("create event",data);

    if (data.title && data.start) {

      console.log(data);

      fetch(`${process.env.REACT_APP_BACKEND_URL}/event/create`, {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
          authorisation: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .catch(error => console.error(error))

      handleCreateClose()

      // console.log(schedule);

      setSchedule([...schedule, data])
      props.onData([...filter, data])
    }
    else {
      setAllField(false)
    }
  }

  const handleDayClick = (event) => {
    console.log(event);
    var filter = schedule.filter((obj) => (event.dateStr >= obj.start && event.dateStr <= obj.end) || obj.start == event.dateStr)
    setFilter(filter)

    props.onDate(event.dateStr)
    props.onData(filter)
    props.setOpenSidebarMenu(true)
  }


  const handleCreateClose = () => {
    setOpenCreate(false);
    props.onClose(false)
  };

  const handleInputChange = (event) => {
    var { name, value } = event.target;

    if (name == "end") {
      let date = new Date(value);
      date.setDate(date.getDate() + 1)
      value = date.toISOString().substring(0, 10)
    }

    setData({ ...data, [name]: value });

    console.log(data);
  };


  return (
    <div ref={boxRef} className='box-page'>
      <div className="box-header">
        <div className='box-back' onClick={sidebarMenuHandler}>
          <i ref={iconRef} className="fa-solid fa-chevron-right mr-10" style={{ cursor: "pointer" }}></i>Agenda</div>
      </div>
      <div className="box-body">
        {openCreate ? (
          <article>

            <section >
              <div className="form">
                <p>Quelle est le titre de votre evenement ? *</p>
                <input type="text" name="title" onChange={handleInputChange} required></input>
                <p>Decrivez votre evenement :</p>
                <input type="text" name="description" onChange={handleInputChange} required></input>
                <p>Quand aura lieux votre evenement ? *</p>
                <input type="date" name="start" onChange={handleInputChange} ></input>
                <p>Quand se terminera votre evenement ?</p>
                <input type="date" name="end" onChange={handleInputChange} ></input>
                <p className={styles.message}>laisser vide si ça ne dure qu'une journée</p>

              </div>
            </section>

            <div className={styles.btn}>
              <button onClick={() => handleCreateClose()} className='btn btn-primary'><i className="fa-solid fa-chevron-left mr-10" style={{ cursor: "pointer" }}></i>retour</button>
              {!allField &&
                <p className={styles.allField}>pensez a remplir les champs titre et date de debut </p>
              }
              <button onClick={() => createEvent()} className='btn btn-primary'>Ajouter<i className="fa-solid fa-square-plus ml-10"></i></button>
            </div>
          </article>
        ) :

          <article className={styles.disableHover}>
            <FullCalendar
              locale={frLocale}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              events={schedule}
              // eventContent={renderEventContent}
              // events={schedule}
              dateClick={handleDayClick}
            />
          </article>
        }
      </div >
    </div >
  )
}

export default AgendaBox