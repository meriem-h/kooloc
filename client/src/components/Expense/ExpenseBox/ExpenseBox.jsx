import React, { useRef, useEffect } from 'react'
import ExpenseItem from '../ExpenseItem/ExpenseItem'
import styles from "./expensebox.module.scss"
import getFormatedDate from "../../../utils/date"



function ExpenseBox(props) {
  let boxRef = props.boxRef
  const sidebarMenuHandler = () => {
    let setOpenSidebarMenu = props.setOpenSidebarMenu;
    let openSidebarMenu = props.openSidebarMenu;

    setOpenSidebarMenu(!openSidebarMenu)
    props.setDetail(null)
  }

  const newExpenseHandler = () => {
    props.setOpenSidebarMenu(true)
    props.setDetail(null)

  }

  const iconRef = useRef(null)

  useEffect(() => {
    if (props.openChatMenu) {
      iconRef.current.className = "fa-solid fa-chevron-right mr-10"
    } else {
      iconRef.current.className = "fa-solid fa-chevron-left mr-10"
    }
  }, [])

  return (
    <div ref={boxRef} className='box-page'>
      <div className="box-header">
        <div className='box-back' onClick={sidebarMenuHandler}><i ref={iconRef} className="fa-solid fa-chevron-right mr-10"></i>Dépenses</div>
      </div>
      <div className='d-flex flex-wrap'>
        {
          props.expenseCards ?
            props.expenseCards.map((item, key) =>

              <div style={{ backgroundColor: item.primaryColor, borderColor: item.secondaryColor }} key={key} className={styles.expenseCards}>
                <h4>{item.name}</h4>
                <span>{item.sum.toFixed(2)} €</span>
              </div>

            )
            :
            null
        }
      </div>
      {
        props.expenses ?
        <div style={{height:"85%",overflow:'auto'}}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Nom</th>
                  {/* <th>description</th> */}
                  <th>Ajouter par</th>
                  {/* <th>Date d'ajout</th> */}
                  <th>Catégorie</th>
                  <th>prix</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>

                {
                  props.expenses ?
                    props.expenses.map((item, key) => (<ExpenseItem selectedExpenseHandler={props.selectedExpenseHandler} item={item} key={item.id} />))
                    :
                    null
                }
              </tbody>
            </table>
        </div>
          : null
      }
      <div className="box-footer d-flex flex-end"><button onClick={newExpenseHandler} className='btn btn-primary'>Ajouter une depense</button></div>
    </div>
  )
}

export default ExpenseBox