import React, { useEffect, useState, useRef } from 'react'
import { useOutletContext, useParams } from "react-router-dom";
import styles from "./expense.module.scss"
import ExpenseBox from './ExpenseBox/ExpenseBox'
import ExpenseSidebar from './ExpenseSidebar/ExpenseSidebar'


function Expense() {
  const params = useParams();

  const getExpenseDetail = () => {
    fetch(`${process.env.REACT_APP_SOCKET_URL}/expenses/${params.id}`)
    .then(res => res.json())
    .then(data => {
      setDetail(data)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getExpenseDetail();
  }, [params])

  const [openSidebarMenu, setOpenSidebarMenu] = useState(false)

  const [context, setContext] = useOutletContext();

  const [expenses, setExpenses] = useState(null)

  const [selectedExpenses, setSelectedExpenses] = useState(null)

  const [categories, setCategories] = useState(null)

  const [detail, setDetail] = useState(null)
  const [expenseCards, setExpenseCards] = useState(null)

  const [editModeCategory, setEditModeCategory] = useState(false)

  const getExpense = () => {
    fetch(`${process.env.REACT_APP_SOCKET_URL}/expenses`)
      .then(res => res.json())
      .then(data => {
        setExpenses(data)
      })
      .catch(err => console.log(err))
  }

  const getExpenseCard = () => {
    fetch(`${process.env.REACT_APP_SOCKET_URL}/expenses/expensecards`)
      .then(res => res.json())
      .then(data => {
        setExpenseCards(data)
      })
      .catch(err => console.log(err))
  }

  const expenseSubmitHandler = (id, name, price, category, description, categoryName,color) => {

    const payload = {
      id: id,
      name: name,
      category: category,
      price: price,
      description: description,
      newCategory: categoryName,
      newColor:color,
      CreatedBy: context.user.id
    }

    if (context.socket) {
      context.socket.emit('newExpense', payload)
    }
    
    setDetail(null)
    
  }

  let sidebarRef = useRef(null)
  let boxRef = useRef(null)


  useEffect(() => {
    if (context.socket) {
      context.socket.on("newExpense", () => {
        getExpense()
      })
    }
  })

  useEffect(() => {
    getExpenseCard();
  }, [expenses])

  useEffect(() => {
    getExpense();
    getExpenseCard();

    fetch(`${process.env.REACT_APP_SOCKET_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data)
      })
      .catch(err => console.log(err))

  }, [])

  useEffect(() => {
    if (!openSidebarMenu) {
      if (window.innerWidth > 975) {
        sidebarRef.current.classList.add("d-none")
        sidebarRef.current.classList.remove("flex-1")
      } else {
        sidebarRef.current.classList.add("d-none")
        boxRef.current.classList.remove("d-none")
        sidebarRef.current.classList.remove("flex-1")
      }
    } else {
      if (window.innerWidth > 975) {
        sidebarRef.current.classList.remove("d-none")
        sidebarRef.current.classList.remove("flex-1")
      } else {
        sidebarRef.current.classList.remove("d-none")
        sidebarRef.current.classList.add("flex-1")
        boxRef.current.classList.add("d-none")
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

  const selectedExpenseHandler = (id) => {
    if (expenses) {
      let expense = expenses.filter(x => x.id == id)[0]
      setSelectedExpenses(expense)
      setOpenSidebarMenu(true)

    }

  }

  return (
    <div className='content-page'>
      <ExpenseSidebar detail={detail} editModeCategory={editModeCategory} setEditModeCategory={setEditModeCategory} selectedExpenses={selectedExpenses} setSelectedExpenses={setSelectedExpenses} categories={categories} expenseSubmitHandler={expenseSubmitHandler} openSidebarMenu={openSidebarMenu} sidebarRef={sidebarRef} setOpenSidebarMenu={setOpenSidebarMenu} />
      <ExpenseBox setDetail={setDetail} expenseCards={expenseCards} expenses={expenses} selectedExpenseHandler={selectedExpenseHandler} setOpenSidebarMenu={setOpenSidebarMenu} boxRef={boxRef} openSidebarMenu={openSidebarMenu} />
    </div>
  )
}

export default Expense