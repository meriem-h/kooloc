import React from 'react'
import styles from "./shoppingitem.module.scss"

function ShoppingItem(props) {
  return (
    <div id={props.list.id} onClick={(e) => props.getListId(e)} className={styles.shoppingItem}>
        {props.list.isPrivate &&
          <i className='fa-solid fa-lock' style={{margin : '2px', marginRight : '2px'}}></i>
        }
        <span>{ props.list.name }</span>
        {(props.list.CreatedBy === props.userId || props.list.CreatedBy === null)&&
          <i className="fa-solid fa-trash" style={{ float : 'right'}} onClick={() => props.deleteList(props.list.id)}></i>
        }
    </div>
  )
}

export default ShoppingItem