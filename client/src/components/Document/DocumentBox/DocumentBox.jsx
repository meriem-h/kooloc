import React, { useRef, useEffect } from 'react'
import styles from './documentbox.module.scss'

function DocumentBox(props) {
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
        <div className='box-back' onClick={sidebarMenuHandler}><i ref={iconRef} className="fa-solid fa-chevron-right mr-10" style={{ cursor: "pointer" }}></i>Documents</div>
      </div>
      <div className="box-body">
        {props.fileDetail && <embed src={props.fileDetail} width="100%" height="100%" type="application/pdf"/>}
      </div>
      <div className="box-footer">
        {
          props.fileInfo ?

          <div className='d-flex justify-content-around'>
            <span>nom : {props.fileInfo?.name }</span><span>Ajouter par : { props.fileInfo?.user.firstName + " " + props.fileInfo?.user.lastName[0]}</span> <span>taille : { props.fileInfo.size}</span><span>type : { props.fileInfo.type}</span><span><button onClick={() => props.handleDeleteFile()} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button></span>
          </div>
          :
          null
        }
      </div>
    </div>
  )
}

export default DocumentBox