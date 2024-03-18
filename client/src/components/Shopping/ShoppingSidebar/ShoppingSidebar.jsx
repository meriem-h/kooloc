import React, { useEffect, useState, useRef } from 'react'
import ShoppingItem from "../ShoppingItem/ShoppingItem"

function ShoppingSidebar(props) {
  
  const formRef = useRef(null)
  const btnRef = useRef(null)
  const inputRef = useRef(null)
  const checkRef = useRef(null)

  const sidebarRef = props.sidebarRef


  const sidebarHandler = () => props.setOpenSidebarMenu(!props.openSidebarMenu)

  const createListHandler = () => {
    btnRef.current.classList.add('d-none');
    formRef.current.classList.remove('d-none');
    inputRef.current.focus();
  };


  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      btnRef.current.classList.remove('d-none');
      formRef.current.classList.add('d-none');
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const shoppingListName = inputRef.current.value;
    const isPrivate = checkRef.current.checked;
    props.addList(shoppingListName, isPrivate);
    inputRef.current.value = "";
    
    btnRef.current.classList.remove('d-none');
    formRef.current.classList.add('d-none');
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
        {
          props.shoppingList.map((list, key) => {
            return <ShoppingItem getListId={props.getListId} key={key} list={list} userId={props.userId} deleteList={props.deleteList}/>  
          })
        }
      </div>
      <div className="sidebar-footer">
        <button ref={btnRef} className='btn btn-primary' onClick={createListHandler}>Nouvelle liste d'achat <i className="fa-solid fa-square-plus ml-10"></i></button>
        <form ref={formRef} onSubmit={(e) => submitHandler(e)} action="" className='d-flex d-none'>
          <div style={{ display : 'flex', flexDirection : 'column', margin : '2px', alignItems : 'center'}}>
            <div>Privée </div>
            <input ref={checkRef} type="checkbox" />
          </div>
          <input ref={inputRef} type="text" onKeyDown={handleInputKeyDown} />
          <button className='btn btn-primary'><i className="fa-solid fa-floppy-disk"></i></button>
        </form>
      </div>
    </div>
  )
}

export default ShoppingSidebar