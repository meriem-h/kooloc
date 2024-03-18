import React, { useRef } from 'react'
import styles from "./pollsidebar.module.scss"
import { useNavigate } from 'react-router-dom'


function PollSidebar(props) {
  const navigate = useNavigate()
  let sidebarRef = props.sidebarRef

  const pollHandler = (id) => {
    props.setVotes([])
    navigate("/dashboard/polls/" + id)
  }

  const sidebarHandler = () => {
    let setOpenSidebarMenu = props.setOpenSidebarMenu;
    let openSidebarMenu = props.openSidebarMenu;

    setOpenSidebarMenu(!openSidebarMenu)
  }

  const questionRef = useRef(null)

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
        {
          !props.createMode ?

            props.polls ?
              props.polls.map((p, key) =>
                <div onClick={() => pollHandler(p.id)} key={key} className={styles.poll}>
                  <span>{p.question}</span>
                  {
                    p.userId === null || p.userId == props.context.user?.id ?
                      <span><button onClick={(e) => props.handleDeletePoll(e,p.id)} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button></span>
                      :
                      null
                  }
                </div>)

              :
              null


            :

            <form action="" className='p-10'>
              <input ref={questionRef} type="text" placeholder="Question" />
              <div className='mt-10'>
                {
                  props.choices.map((s, key) => <div key={key}><input type="text" className='mt-10' placeholder={"choix " + s.id} onChange={(e) => props.handleChange(e, key)} />{props.choices.length > 1 ? <i style={{ color: "red", cursor: "pointer" }} id={s.id} className="fa-solid fa-trash" onClick={(e) => props.handleDelete(e)}></i> : null}</div>)
                }
              </div>
              <button type='button' style={{ color: "#000" }} className='btn btn-primary success mt-10' onClick={props.addChoice}>+ suggestion</button>
            </form>
        }
      </div>
      <div className="sidebar-footer">
        {
          !props.createMode ?
            <button className='btn btn-primary' onClick={() => { props.setCreateMode(true) }}>Creer un sondage</button>
            :
            <button className='btn btn-primary' onClick={() => props.handleSubmit(questionRef)}>Lancer le sondage<i className="fa-solid fa-square-plus ml-10"></i></button>
        }
      </div>
    </div>
  )
}

export default PollSidebar