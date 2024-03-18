import React, { useState, useEffect, useRef } from 'react'
import { useOutletContext } from "react-router-dom";

function Secret() {
  const [context, setContext] = useOutletContext();
  const [state, setState] = useState()
  const [shoppingList, setShoppingList] = useState({})
  const socket = context.socket;
  const inputRef = useRef()

  function getItemList() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shoppinglists/100`)
      .then(res => res.json())
      .then(data => { 
        setShoppingList(data) 
      })
  }

  function submitHandler(e) {
    e.preventDefault();
    const data = inputRef.current.value
    socket.emit("secret", { data, id: shoppingList.id }, (data) => {
    })
    inputRef.current.value = ""
  }

  useEffect(() => {
    getItemList()
  }, [])

  useEffect(() => {
    console.log(socket)
    if (socket) {
      socket.on('new', (data) => {
        console.log(data)
        getItemList()
      })
      socket.emit("joinRoom",{roomName:"ShoppingList_100"})
    }
  }, [context.socket])

  return (
    <div className=" m-20">
      {
        JSON.stringify(shoppingList)
      }

      <div className='m-20'>
        <form onSubmit={(e) => submitHandler(e)} action="">
          <input ref={inputRef} type="text" />
          <button type="submit">SEND !</button>
        </form>
      </div>
    </div>
  )
}


function ShoppingList () {

}


export default Secret