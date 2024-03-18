import React, { useEffect, useState, useRef } from 'react'
import { useOutletContext } from "react-router-dom";
import ShoppingBox from './ShoppingBox/ShoppingBox'
import ShoppingSidebar from './ShoppingSidebar/ShoppingSidebar'

function Shopping() {

  const [openSidebarMenu, setOpenSidebarMenu] = useState(true)
  // eslint-disable-next-line
  const [context, setContext] = useOutletContext();
  const [shoppingList, setShoppingList] = useState([])
  const [selectedListId, setSelectedListId] = useState(null)
  // const [shoppingItemSelected, setShoppingItemSelected] = useState([])

  // const shoppinglistItemHandler = (e) => {
  //   const isChecked = e.target.checked
  //   if (isChecked) {
  //     setShoppingItemSelected(laststate => [e.target.value, ...laststate])
  //   } else {
  //     let newState = shoppingItemSelected.filter(x => x !== e.target.value)
  //     setShoppingItemSelected(newState)
  //   }

  // }

  // console.log(context)
  const socket = context.socket;

  // useEffect(() => {
  //   console.log(shoppingItemSelected)
  // }, [shoppingItemSelected])

  const getAllList = (userId, houseShareId) => {
    if(userId&&houseShareId){
    fetch(`${process.env.REACT_APP_SOCKET_URL}/shoppingLists?userId=${userId}&id=${houseShareId}`)
      .then(res => res.json())
      .then(data => {
        setShoppingList(data)
      })
      .catch(err => console.log(err))
    }
  }


  const addList = (name, isPrivate) => {
    const payload = {
      name: name, 
      isPrivate: isPrivate,
      CreatedBy: context.user.id,
      houseShareId: context.user.houseShareId
    }
    socket.emit("createShoppingList", payload)
  }

  const deleteList = (id) => {
    socket.emit('deleteShoppingList', { id })
  }

  const addToPrivate = (listId, userId) => {

    const payload = {
      list : {
        id : listId
      },
      user : {
        id : userId
      }
    }
    socket.emit('addToPrivate', payload);
  }

  const removeFromPrivate = (listId, userId) => {
    const payload = {
      list : {
        id : listId
      },
      user : {
        id : userId
      }
    }
    socket.emit('removeFromPrivate', payload);
  }

  const getListId = (e) => {
    const id = +e.target.id
    if(id > 0){
      setSelectedListId(id)
    }
  }

  function addListHandler(data) {
    getAllList(context.user?.id, context.user?.houseShareId)
    if(data.shoppinglist.CreatedBy === context.user?.id){
      setSelectedListId(data.shoppinglist.id)
    }
  }

  function deleteListHandler(data) {
    getAllList(context.user?.id, context.user?.houseShareId)
    if(data?.list?.id === selectedListId){
      setSelectedListId(0)
    }
  }

  function refreshListHandler(data) {
    getAllList(context.user?.id, context.user?.houseShareId)
    if(parseInt(data?.user?.id, 10) === context.user?.id && parseInt(data?.list?.id, 10) === parseInt(selectedListId, 10)){
      setSelectedListId(0)
    }
  }

  useEffect(() => {
    getAllList(context.user?.id, context.user?.houseShareId);

    if (socket) {
      socket.on("newShoppingList", addListHandler)
      socket.on("deleteShoppingList", deleteListHandler)
      socket.emit("joinRoom", { roomName: `Shopping` })
      socket.on('refresh', refreshListHandler)

      return () => {
        socket.off("newShoppingList", addListHandler)
        socket.off("deleteShoppingList", deleteListHandler)
        socket.off("refresh", refreshListHandler)
      }
    }
  // eslint-disable-next-line
  }, [context, selectedListId])

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
      <ShoppingSidebar
        getListId={getListId}
        shoppingList={shoppingList}
        openSidebarMenu={openSidebarMenu}
        sidebarRef={sidebarRef}
        setOpenSidebarMenu={setOpenSidebarMenu}
        addList={addList}
        userId={context.user?.id}
        deleteList={deleteList}
      />
      {
        selectedListId ?
          <ShoppingBox
            setOpenSidebarMenu={setOpenSidebarMenu}
            boxRef={boxRef}
            openSidebarMenu={openSidebarMenu}
            selectedListId={selectedListId}
            socket={context.socket}
            // shoppinglistItemHandler={shoppinglistItemHandler}
            addToPrivate={addToPrivate}
            removeFromPrivate={removeFromPrivate}
            userId={context.user?.id}
            house={context.house?.house}

          />
          :
          null
      }

    </div>
  )
}

export default Shopping