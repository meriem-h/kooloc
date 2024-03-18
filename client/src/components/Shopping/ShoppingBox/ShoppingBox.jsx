import React, { useRef, useEffect, useState } from 'react'
import ShoppingListItem from './ShoppingListItem'

function ShoppingBox(props) {

  const [shoppingList, setShoppingList] = useState({})
  const [privateIsOpen, setPrivateIsOpen] = useState(false)

  // const shoppinglistItemHandler = props.shoppinglistItemHandler
  const [shoppingItemSelected, setShoppingItemSelected] = useState([])

  const shoppinglistItemHandler = (e) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setShoppingItemSelected(laststate => [e.target.value, ...laststate])
    } else {
      let newState = shoppingItemSelected.filter(x => x !== e.target.value)
      setShoppingItemSelected(newState)
    }

  }

  useEffect(() => {
    //console.log(shoppingItemSelected)
  }, [shoppingItemSelected])


  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(props.userId)
    const content = inputRef.current.value
    inputRef.current.value = ""
    props.socket.emit("addItem", { content: content, shopListId: props.selectedListId, creatorId: props.userId })
  }

  const handleCheck = (e) => {
    const payload = {
      id: e.target.value,
      isComplete: e.target.checked
    }
    props.socket.emit("checkItem", payload)
  }

  const handleDeleteItem = (id) => {
    const payload = {
      id: [id]
    }
    let isConfirm = window.confirm("confirmer la suppression");
    if (isConfirm) {
      props.socket.emit("deleteItem", payload)
    }
  }

  const isInPrivate = (id) => {
    let isInPrivate = false;

    shoppingList.Users.forEach((user) => {
      // eslint-disable-next-line
      if(user.id == id){
        isInPrivate = true;
      }
    })
    return isInPrivate;
  }

  const handlePrivate = (id) => {
    if(isInPrivate(id)){
      props.removeFromPrivate(props.selectedListId, id)
    }else{
      props.addToPrivate(props.selectedListId, id)
    }
  }

  const handleAddExpenseItem = (id, shoppingListId) => {
    const payload = {
      id: [id],
      shoppingListId: shoppingListId,
      CreatedBy : props.userId
    }
    let isConfirm = window.confirm("confirmer l'ajout aux dépenses");
    if (isConfirm) {
      props.socket.emit("toExpense", payload)
    }
    // console.log(id)
  }

  const multipleHandleDeleteItem = () => {
    const payload = {
      id: shoppingItemSelected
    }

    let isConfirm = window.confirm("confirmer la suppression");
    if (isConfirm) {
      props.socket.emit("deleteItem", payload)
      setShoppingItemSelected([])
    }
  }

  const multipleHandleToSpendItem = () => {
    const payload = {
      id: shoppingItemSelected,
      CreatedBy : props.userId
    }

    let isConfirm = window.confirm("confirmer l'ajout aux dépenses");
    if (isConfirm) {
      props.socket.emit("toExpense", payload)
      setShoppingItemSelected([])
    }
  }


  function getShoppingList(id) {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shoppinglists/${id}`)
      .then(res => res.json())
      .then(data => {
        setShoppingList(data)
      })
  }

  useEffect(() => {
    getShoppingList(props.selectedListId)
    
    props.socket?.emit("joinRoom", { roomName: `Shopping_${props.selectedListId}` })
    props.socket?.on("addItem2", socketAddItemHandler)
    props.socket?.on('refresh', () => { 
      getShoppingList(props.selectedListId)
    })

    return () => {
      props.socket?.off("addItem2", socketAddItemHandler)
      props.socket?.off("refresh")
    }
    
    // eslint-disable-next-line
  }, [props.selectedListId])

  const socketAddItem = (param1) => () => {
    getShoppingList(param1)
  };

  const socketAddItemHandler = socketAddItem(props.selectedListId)



  // FRONT SECTION //
  let boxRef = props.boxRef
  let inputRef = useRef(null)
  const iconRef = useRef(null)

  const sidebarMenuHandler = () => {
    let setOpenSidebarMenu = props.setOpenSidebarMenu;
    let openSidebarMenu = props.openSidebarMenu;
    setOpenSidebarMenu(!openSidebarMenu)
  }

  useEffect(() => {
    if (props.openSidebarMenu) {
      iconRef.current.className = "fa-solid fa-chevron-right mr-10"
    } else {
      iconRef.current.className = "fa-solid fa-chevron-left mr-10"
    }
  })
  // END SECTION //

  return (
    <>    
    {(privateIsOpen)&&
      <div className='modale-wrapper' onClick={() => {setPrivateIsOpen(false)}}></div>
    }
    <div ref={boxRef} className='box-page'>
      <div className="box-header">
        <div className='box-back' onClick={sidebarMenuHandler}>
          <i ref={iconRef} className="fa-solid fa-chevron-right mr-10" style={{ cursor: "pointer" }}></i>
          Listes
        </div>
        <>
          <strong>{shoppingList?.name}</strong>
        </>
        <div>
          {(shoppingItemSelected.length > 0) ?
          <>
          <button className='btn btn-success mr-5' onClick={multipleHandleToSpendItem}>Ajouter au depenses</button>
          <button className='btn btn-danger' onClick={multipleHandleDeleteItem}>Supprimer</button>
          </>
          :
          <>
            {(shoppingList?.isPrivate)?
            <>
            <div style={{display: 'flex', alignItems : 'center'}}>
              {shoppingList?.Users.map((user, i) => {
                let initials = user.firstName.substring(0,1) + user.lastName.substring(0,1)
                return (
                  <div key={i} className="tooltip" style={{ border : "1px solid white" , padding : '2px', marginRight : '4px', marginLeft : '4px'}}>
                    {(shoppingList?.CreatedBy === user.id) && <i style={{ margin : '2px' }} className='fa-solid fa-crown'></i>}
                    {initials}
                    <span className='tooltiptext'>{user.firstName} {user.lastName}</span>
                  </div>
                  
                  )
              })
              }
              <strong style={{ marginRight : '5px'}}>Privée</strong>
              {(shoppingList?.CreatedBy === props.userId )&&
                <i onClick={() => { setPrivateIsOpen(!privateIsOpen)}} style={{ cursor : 'pointer' }} className="fa-solid fa-user-plus"></i>
              }
              {(privateIsOpen)&&
            <div className='modale'>
              <ul className='dropdown'>
                {props.house?.users?.map((user, i) => {
                  if(shoppingList.CreatedBy !== user.id){
                    return (
                      <li className="li_private" key={i} id={user.id} onClick={(e) => handlePrivate(e.currentTarget.id)}>
                      {isInPrivate(user.id) && <i style={{ marginRight : '3px'}}className="fa-solid fa-check"></i>}
                        {user.firstName} {user.lastName} 
                      </li>
                    )
                  }else{
                    return false
                  }
                  
                })}
              </ul>
              </div>
              }
             
            </div>
            </>
            :
            <span>Public</span>

            }
          </>
          }
        </div>
      </div>
      <div className="box-body">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Article</th>
              <th>Creer par</th>
              <th>Date d'ajout</th>
              <th>Date de modification</th>
            </tr>

          </thead>
          <tbody>

            {
              shoppingList?.shoppingItems ?
                shoppingList.shoppingItems?.map((item, key) => (<ShoppingListItem item={item} key={item.id} shoppinglistItemHandler={shoppinglistItemHandler} handleCheck={handleCheck} handleDeleteItem={handleDeleteItem} handleAddExpenseItem={handleAddExpenseItem} />))
                :
                <></>
            }
          </tbody>
        </table>
      </div>
      <div className="box-footer ">
        <form onSubmit={handleSubmit} className='d-flex'>
          <input type="text" ref={inputRef} />
          <button type="submit" className='btn btn-primary'>
            <i className="fa-solid fa-plus"></i>
          </button>
        </form>
      </div>
    </div>

    </>
  )
}

export default ShoppingBox