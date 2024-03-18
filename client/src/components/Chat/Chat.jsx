import React, { useEffect, useState, useRef } from 'react'
import { useOutletContext, useParams } from "react-router-dom";
import ChatBox from './ChatBox/ChatBox';
import ChatSideBar from './ChatSidebar/ChatSidebar';
import styles from "./chat.module.scss"

export default function Chat() {
  const params = useParams();
  const [context, setContext] = useOutletContext();

  const [openChatMenu, setOpenChatMenu] = useState(true);
  const [chatroomList, setChatroomList] = useState([]);
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  const socket = context.socket;
  const userId = context.user?.id;
  const houseShareId = context.user?.houseShareId

  let sidebarRef = useRef(null)
  let chatBoxRef = useRef(null)

  const getAllChatrooms = () => {
    if (userId && houseShareId) {
      fetch(`${process.env.REACT_APP_SOCKET_URL}/chatroom?userId=${userId}&id=${houseShareId}`)
        .then(res => res.json())
        .then(data => {
          setChatroomList(data);
        })
        .catch(err => console.log(err))
    }
  }

  const addChatroom = (name, isPrivate) => {
    const payload = {
      name: name, 
      isPrivate: isPrivate,
      CreatedBy: context.user.id,
      houseShareId: context.user.houseShareId
    }
    socket.emit("createChatroom", payload)
  }

  const deleteChatroom = (id) => {
    console.log("DELETE ROOM N°" + id)
  }

  const sendMessage = (message) => {
    const payload = {
      room: selectedChatroom,
      message: message,
      user: context.user.id
    }
    socket.emit("sendMessage", payload);
  }

  const newChatroom = (data) => {
    getAllChatrooms();
  }

  useEffect(() => {
    getAllChatrooms();

    if (socket) {
      socket.on("newChatroom", newChatroom)
      return () => {
          socket.off("newChatroom", newChatroom)
      }
    }
  },[context])

  useEffect(() => {
    if (!openChatMenu) {
      if (window.innerWidth > 975) {
        sidebarRef.current.classList.add(styles.dNone)
        sidebarRef.current.classList.remove(styles.flex1)
      } else {
        sidebarRef.current.classList.add(styles.dNone)
        chatBoxRef.current.classList.remove(styles.dNone)
        sidebarRef.current.classList.remove(styles.flex1)
      }
    } else {
      if (window.innerWidth > 975) {
        sidebarRef.current.classList.remove(styles.dNone)
        sidebarRef.current.classList.remove(styles.flex1)
      } else {
        sidebarRef.current.classList.remove(styles.dNone)
        sidebarRef.current.classList.add(styles.flex1)
        chatBoxRef.current.classList.add(styles.dNone)
      }
    }
  }, [openChatMenu])

  useEffect(() => {
    if(window.innerWidth < 975) {
      setOpenChatMenu(true)
    }
  }, [])


  window.onresize = () => {
    if (window.innerWidth > 975) {
      setOpenChatMenu(true)
    } else {
      setOpenChatMenu(false)
    }
  };

  return (
    <div className={styles.chat}>
      <ChatSideBar 
        openChatMenu={openChatMenu} 
        sidebarRef={sidebarRef} 
        setOpenChatMenu={setOpenChatMenu}
        userId={userId}
        chatroomList={chatroomList}
        addChatroom={addChatroom}
        setSelectedChatroom={setSelectedChatroom}
        deleteChatroom={deleteChatroom}
      />

      {selectedChatroom &&
        <ChatBox 
          setOpenChatMenu={setOpenChatMenu} 
          chatBoxRef={chatBoxRef} 
          openChatMenu={openChatMenu} 
          chatroomList={chatroomList}
          selectedChatroom={selectedChatroom}
          sendMessage={sendMessage}
          socket={socket}
          userId={userId}
        />
      }
    </div>
  )
}
