import React from 'react'
import styles from "./documentsidebar.module.scss"
import { useNavigate } from 'react-router-dom'

function DocumentSidebar({ sidebarRef, setOpenSidebarMenu, openSidebarMenu, handleFileSubmit, handleFileChange, files, addMode, setAddMode }) {

  const navigate = useNavigate()

  const sidebarHandler = () => {
    setOpenSidebarMenu(!openSidebarMenu)
  }

  const documentHandler = (id) => {
    navigate("/dashboard/documents/" + id)
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
      <div className="sidebar-body p-10">
        {
          addMode ?
            <form onSubmit={(e) => handleFileSubmit(e)} action="">
              <input onChange={handleFileChange} type="file" />
              <button className='btn btn-primary' type="submit">Ajouter</button>
            </form>
            :
            files?.map((item, key) => <div onClick={() => documentHandler(item.id)} className={styles.document} key={item.id}>{item.name}</div>)
        }

      </div>
      <div className="sidebar-footer">
        {
          addMode ?
            <button className='btn btn-primary' onClick={() => setAddMode(false)}>Annuler<i className="fa-solid fa-square-plus ml-10"></i></button>
            :
            <button className='btn btn-primary' onClick={() => setAddMode(true)}>Ajouter un document<i className="fa-solid fa-square-plus ml-10"></i></button>
        }
      </div>
    </div>
  )
}

export default DocumentSidebar