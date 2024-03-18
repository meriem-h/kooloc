import React, { useRef, useEffect } from 'react'
import styles from "./expensesidebar.module.scss"
import getFormatedDate from "../../../utils/date"

function ExpenseSidebar(props) {

  useEffect(() => {
    if (props.selectedExpenses) {
      expenseName.current.value = props.selectedExpenses.name
      expenseId.current.value = props.selectedExpenses.id
    }
  })
  useEffect(() => {
    console.log(props.detail?.isFinalised)
    if (props.detail != null) {
      props.setOpenSidebarMenu(true)
    }
  }, [props.detail])


  const handleSubmit = () => {
    if((expenseCategory.current?.value || categoryName.current?.value) && expensePrice.current?.value){
      props.expenseSubmitHandler(expenseId.current?.value, expenseName.current?.value, expensePrice.current?.value, expenseCategory?.current?.value, expenseDescription.current?.value, categoryName.current?.value,categoryColor.current?.value)
    
      if (expenseCategory.current) {
        expenseCategory.current.value = ""
      }
      expensePrice.current.value = ""
      expenseName.current.value = ""
      expenseDescription.current.value = ""
      expenseId.current.value = ""
      if (categoryName.current) {
        categoryName.current.value = ""
      }
      props.setEditModeCategory(false)
      sidebarHandler();
    }
  }

  let sidebarRef = props.sidebarRef

  const expenseName = useRef(null);
  const expensePrice = useRef(null);
  const expenseCategory = useRef(null);
  const expenseDescription = useRef(null);
  const expenseId = useRef(null);
  const categoryName = useRef(null);
  const categoryColor = useRef(null);

  const sidebarHandler = () => {
    let setOpenSidebarMenu = props.setOpenSidebarMenu;
    let openSidebarMenu = props.openSidebarMenu;

    setOpenSidebarMenu(!openSidebarMenu)
  }
  return (
    <div ref={sidebarRef} className='sidebar-page'>
      <div className="sidebar-header">
        {
          props.detail?.name ?
          <>
            <h2> {props.detail.name} </h2>
            <input ref={expenseName} type="hidden" value={props.detail.name} />
          </>
            :
            <input ref={expenseName} type='text' placeholder='Nom de la depense' />}
        {
          window.innerWidth < 975 ?
            <i onClick={sidebarHandler} className="fa-solid fa-chevron-left ml-5" style={{ cursor: "pointer" }}></i>
            :
            ""
        }
      </div>
      <div className="sidebar-body p-10">
        {
          props.detail?.id ?
            <input ref={expenseId} type="hidden" value={props.detail.id} />
            :
            null

        }
        {
          props.detail?.expense ?
            <h4 className='mb-10' style={{ color: props.detail.expense.secondaryColor }}>{props.detail.expense.name}</h4>
            :
            props.categories && !props.detail?.isFinalised ?
              <>
                {
                  !props.editModeCategory ?
                    <select ref={expenseCategory} className='mb-20' style={{ width: "100%", fontSize: "20px", height: "40px" }} name="pets" id="pet-select" required>
                      <option disabled>-- Choisir une categorie --</option>
                      {
                        props.categories.map((item, key) =>
                          <option key={item.id} value={item.id}>{item.name}</option>
                        )
                      }
                    </select>
                    :
                    null
                }
                {
                  props.editModeCategory ?
                    <div className='mb-20'>
                      <input ref={categoryName} type="text" placeholder='nom de la categorie' className='mb-10' required/>
                      <input ref={categoryColor} className="mb-20" style={{height:"50px"}} type="color" required/>
                      <button type='button' className='btn btn-secondary' onClick={() => props.setEditModeCategory(false)}>Annuler</button>
                    </div>
                    :
                    <button type='button' className='btn btn-secondary mb-20' onClick={() => props.setEditModeCategory(true)}>Ajouter une catégorie</button>
                }
              </>
              :
              null
        }
        {
          props.detail?.price ?
            <h3>{props.detail.price / 1000} €</h3>
            :
            <input ref={expensePrice} type="number" placeholder='Montant' min="0.00" step="0.01" />
        }
        <p>Description :</p>
        {
          props.detail != null ?
          <>
            <textarea readOnly="readonly" value={props.detail.description} ref={expenseDescription} name="" id="" cols="32" rows="15"></textarea>
          </>
            :
            props.detail?.isFinalised ?
              <textarea readOnly="readnly" ref={expenseDescription} name="" id="" cols="32" rows="15"></textarea>
              :
              <textarea ref={expenseDescription} name="" id="" cols="32" rows="15" placeholder='Entrez votre description'>{props.detail?.isFinalised}</textarea>
        }
        {
          props.detail?.createdAt ?
            <>
              <p>Ajouter le :</p>
              <h3>{getFormatedDate(props.detail.createdAt)}</h3>
            </>

            :
            null
        }
      </div>
      <div className="sidebar-footer">
        {
          !props.detail?.isFinalised ?
            <>
              <button className='btn btn-primary mr-5' onClick={handleSubmit}>Sauvegarder<i className="fa-solid fa-square-plus ml-10"></i></button>
              <button className='btn btn-secondary' onClick={sidebarHandler}>Annuler<i className="fa-solid fa-times ml-10"></i></button>
            </>
            :
            null
        }
      </div>
    </div>
  )
}

export default ExpenseSidebar