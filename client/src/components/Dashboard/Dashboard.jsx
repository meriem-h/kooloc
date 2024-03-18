import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ItemsList } from "./ItemsList";
import { FilesList } from "./FilesList";
import { LastPoll } from "./LastPoll";
import styles from "./dashBoard.module.scss";
import { useOutletContext } from "react-router-dom";

export const DashboardComp = (props) => {
  const context = useOutletContext();
  const userId = context[0].user?.id;
  const houseShareId = context[0].user?.houseShareId;
  const [expenseCategories, setExpenseCategories] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [shoppingItems, setShoppingItems] = useState(null);
  const [files, setFiles] = useState([]);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    getExpenseCategories();
  }, []);

  useEffect(() => {
    if (userId && houseShareId) {
      getShoppingList(userId, houseShareId);
    }
  }, [userId, houseShareId]);

  useEffect(() => {
    getShoppingItems(shoppingList);
  }, [shoppingList]);

  useEffect(() => {
    if (userId && houseShareId) {
      getDocuments(userId, houseShareId);
    }
  }, [userId, houseShareId]);

  useEffect(() => {
    if (userId && houseShareId) {
      getPolls(userId, houseShareId);
    }
  }, [userId, houseShareId]);

  const getExpenseCategories = () => {
    fetch(`${process.env.REACT_APP_SOCKET_URL}/expenses/expensecards?userId=${userId}&id=${houseShareId}`)
      .then((res) => res.json())
      .then((data) => {
        setExpenseCategories(data);
      })
      .catch((err) => console.log(err));
  };

  const getShoppingList = (userId, houseShareId) => {
    fetch(
      `${process.env.REACT_APP_SOCKET_URL}/shoppinglists?userId=${userId}&id=${houseShareId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setShoppingList(data);
      })
      .catch((err) => console.log(err));
  };

  const getShoppingItems = (shoppingList) => {
    const items = shoppingList.map((obj) => obj.shoppingItems);
    setShoppingItems(items);
  };

  const getDocuments = (userId, houseShareId) => {
    const token = localStorage.getItem("token");
    console.log("HERE", houseShareId)
    fetch(`${process.env.REACT_APP_SOCKET_URL}/documents?userId=${userId}&houseShareId=${houseShareId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorisation: `BEARER ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
      })
      .catch((err) => console.log(err));
  };

  const getPolls = (userId, houseShareId) => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.REACT_APP_SOCKET_URL}/polls?userId=${userId}&id=${houseShareId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorisation: `BEARER ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPolls(data);
      })
      .catch((err) => console.log(err));
  };

  const formatExpenseData = (expenseCategoriesObj) => {
    const labels = expenseCategoriesObj.map((obj) => obj.name);
    const data = expenseCategoriesObj.map((obj) => obj.sum);

    return {
      labels,
      datasets: [
        {
          label: "Dépenses",
          data: data,
          backgroundColor: expenseCategoriesObj.map((obj) => obj.primaryColor),
          hoverOffset: 4,
        },
      ],
    };
  };

  return (
    <div className={styles.dashboardContainer}>
      {expenseCategories ? (
        <div className={styles.expenseData}>
          <Doughnut data={formatExpenseData(expenseCategories)} />
        </div>
      ) : null}
      {shoppingItems ? <ItemsList itemsList={shoppingItems} /> : null}
      {files ? <FilesList FilesList={files} /> : null}
      {polls ? <LastPoll polls={polls} /> : null}
    </div>
  );
};
