import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from "../expense.module.scss"
import getFormatedDate from "../../../utils/date"

function ExpenseItem({ item,selectedExpenseHandler }) {

    const navigate = useNavigate()

    const test = (id) => {
        navigate("/dashboard/expenses/"+id)
    }

    return (
        <tr onClick={(e) => test(item.id)} style={{backgroundColor:item.expense?.primaryColor}}>
            <td>{item?.id}</td>
            <td>{item?.name}</td>
            {/* <td>{item?.description}</td> */}
            {(item?.CreatedBy)?
                <td>{item?.user.firstName} {item?.user.lastName.substring(0, 1)}.</td>
            :
                <td>{"Ancien Kooloc"}</td>
            }
            {/* <td>{item?.createdAt}</td> */}
            <td>{item?.expense?.name}</td>
            <td>{item?.price ? item?.price / 1000 + " €" : null}</td>
            <td>{!item.isFinalised ? <i onClick={() => selectedExpenseHandler(item.id)} className="fa-solid fa-pen-to-square"></i> : <i className="fa-solid fa-check"></i>}</td>
        </tr>
    )
}

export default ExpenseItem