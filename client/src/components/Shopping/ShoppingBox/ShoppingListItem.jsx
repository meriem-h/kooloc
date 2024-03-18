import React from 'react'
import styles from "./shoppinglistitem.module.scss"
import getFormatedDate from '../../../utils/date'

function ShoppingListItem({ item, handleCheck,shoppinglistItemHandler,handleDeleteItem,handleAddExpenseItem }) {


  function handleCheckbox(e) {
    handleCheck(e)
    shoppinglistItemHandler(e)
  }

  return (
    <tr className={item.isOnSpend ? styles.isOnSpend : item.isComplete ? styles.isComplete : null}>
      <td>{!item.isOnSpend ? <input onChange={(e) => handleCheckbox(e)} type="checkbox" value={item.id} />:null}</td>
      <td>{item.content}</td>
      <td>{item.creator?.firstName + " " + item.creator?.lastName.substring(0,1)+"."}</td>
      <td>{getFormatedDate(item.createdAt)}</td>
      <td>{getFormatedDate(item.updatedAt)}</td>
      <td>
        {
          !item.isOnSpend ?
          <>
            <button onClick={() => handleAddExpenseItem(item.id,item.ShoppingListId)} className='btn btn-success mr-5'><i className="fa-solid fa-plus"></i></button>
            <button onClick={() => handleDeleteItem(item.id)} className='btn btn-danger mr-5'><i className="fa-solid fa-times"></i></button>
          </>
          :
          <i className="fa-solid fa-check"></i>
        }
      </td>
    </tr>
  )
}

export default ShoppingListItem