import io from "socket.io-client"
import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from './App.module.scss';
import LoginButton from "./components/LoginButton/LoginButton";

const socket = io.connect(process.env.REACT_APP_SOCKET_URL)

function App() {
  const [context, setContext] = useState({
    socket: null,
    isConnected: false,
    user: null
  })

  const navigate = useNavigate()

  socket.on('connect', () => {
    console.log('connected on /');
    setContext({
      ...context,
      socket: socket,
    })

    const token = localStorage.getItem('token');

    if (token) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/authbytoken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorisation': token
        },
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)

        if (data.status === "OK") {

          const authSocket = socket;
          authSocket.auth = {token:token}
          setContext({
            ...context,
            socket: authSocket,
            user: data.user,
            isConnected: true
          })

         

        }
      })
      .catch(err => {
        // return navigate("/login")
      })

      
    }

  });

  useEffect(() => {
    if(context.socket != null) {
      socket.on("test",() => {
        console.log("FIRE APP !")
      })
    }
  },[context.socket])

  useEffect(() => {
    console.log(context)
    if(context.socket != null && context.isConnected) {
      socket.emit("logingIn", {houseShareId: context.user.houseShareId, userId: context.user.id})
    }
  },[context.isConnected])


  return (
    <div className={styles.appContainer}>
      <Outlet context={[context, setContext]} />
    </div>
  );
}

export default App;
