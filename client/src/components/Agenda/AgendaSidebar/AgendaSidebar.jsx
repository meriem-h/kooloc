import React, { useState, useEffect } from 'react'

import styles from "./agendasidebar.module.scss"

function AgendaSidebar(props) {
  let sidebarRef = props.sidebarRef
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [showEvent, setShowEvent] = useState();
  const [listOpenEvent, setListOpenEvent] = useState([]);
  const [confirm, setConfirm] = useState([]);

  const context = props.context

  useEffect(() => {
    if (props.data) {
      setData(props.data)
      setListOpenEvent(props.data.map(x => { return { id: x.id, isOpen: false } }));
      setConfirm(props.data.map(x => { return { id: x.id, isDisplay: false } }));
    }
    if (props.date) {
      setDate(props.date)
      // console.log(props.date);
    }
  }, [props.data, props.date])


  const sidebarHandler = () => {
    let setOpenSidebarMenu = props.setOpenSidebarMenu;
    let openSidebarMenu = props.openSidebarMenu;

    setOpenSidebarMenu(!openSidebarMenu)
  }

  const handleDeleteEvent = (event) => {

    var filter = data.filter((obj) => obj.id == event)

    fetch(`${process.env.REACT_APP_BACKEND_URL}/event/delete`, {
      method: 'DELETE', headers: {
        'Content-Type': 'application/json',
        authorisation: `BEARER ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(filter)

    })
      .then(response => response.json())
      .catch(error => console.error(error))

    setData(data.filter((obj) => obj.id !== event))

    handleDelete(event)

  }

  const handleCreate = () => {
    props.onCreate(true)
  }

  const handleDelete = (id) => {
    props.onDelete(id)
  }

  const handleDisplay = (id) => {
    let newList = [...listOpenEvent];
    let event = newList.find(x => x.id == id)
    event.isOpen = !event.isOpen;
    setListOpenEvent(newList);
  }

  const confirmDelete = (id) => {
    let displayList = [...confirm];
    // console.log(displayList)
    let event = displayList.find(x => x.id == id)
    event.isDisplay = !event.isDisplay;
    setConfirm(displayList);
  }


  return (
    <div ref={sidebarRef} className='sidebar-page'>
      <div className="sidebar-header">
        <p className={styles.date} >{date}</p>
      </div>
      <div className="sidebar-body">
        {data.length > 0 ?
          data.map((e) => {
            return (
              <section key={e.title}>
                <article className={styles.event_title}>
                  <p onClick={() => handleDisplay(e.id)} className={styles.event_p} id={e.id} >{e.title}</p>

                  {confirm.find(x => x.id == e.id).isDisplay &&
                    <button onClick={() => handleDeleteEvent(e.id)} className={styles.btn_delete}>supprimer</button>
                  }
                  {context.user.id == e.userId ?
                    <button onClick={() => confirmDelete(e.id)} className={styles.btn_delete}><i className="fa-solid fa-times"></i></button>
                    :
                    <button disabled onClick={() => confirmDelete(e.id)} className={styles.btn_delete}><i className="fa-solid fa-times"></i></button>
                  }


                </article>
                {listOpenEvent.find(x => x.id == e.id).isOpen &&
                  <article className={styles.eventDetail}>
                    <div>
                      <p>{e.UserId.firstName}</p>
                      <p>{e.start}</p>
                    </div>
                    {e.description &&
                      <div>
                        <p>description :</p>
                        <p>{e.description}</p>
                      </div>
                    }
                  </article>
                }
              </section>
            )
          })
          :
          <div className={styles.empty}>
            <img className={styles.img} src="https://cdn0.iconfinder.com/data/icons/empty-state-vol-1-flat/64/3_leaf_empty_no_activity_data_state_interface-512.png" />
            <p> aucun evenement n'est prevue</p>
          </div>

        }
      </div>
      <div className="sidebar-footer">
        <button onClick={() => handleCreate()} className='btn btn-primary'>Ajouter un evènement <i className="fa-solid fa-square-plus ml-10"></i></button>
      </div>
    </div>
  )
}

export default AgendaSidebar