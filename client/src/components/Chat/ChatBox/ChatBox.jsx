import React, { useRef, useEffect, useState } from 'react'
import styles from "./chatbox.module.scss"
import ChatMessage from './ChatMessage'

export default function ChatBox(props) {

    const [messages, setMessages] = useState([])
    const [name, setName] = useState("")
    const [chatroomId, setChatroomId] = useState(null)
    
    let chatBoxRef = props.chatBoxRef
    const messageText = useRef(null)
    const iconRef = useRef(null)
    const activeRoom = props.chatroomList.find(x => x.id == props.selectedChatroom)
    
    const chatMenuHandler = () => {
        let setOpenChatMenu = props.setOpenChatMenu;
        let openChatMenu = props.openChatMenu;
        
        setOpenChatMenu(!openChatMenu)
    }

    const getChatroom = (id) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/chatroom/${id}`)
            .then(res => res.json())
            .then(data => {
                setName(data.name)
                setMessages(data.messages.sort((a,b) => b.id - a.id))
                setChatroomId(data.id)
            })
    }

    const resizeMessageInput = () => {
        messageText.current.style.height = 0;
        let newHeight = messageText.current.scrollHeight
        if (newHeight < 47)  newHeight = 47;
        if (newHeight > 140) newHeight = 140;
        messageText.current.style.height = newHeight + "px";
    }

    const keyDownOnInput = (e) => {
        if (e.code == "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleMessageSend()
        }
    }

    const handleMessageSend = () => {
        if (messageText.current.value == "") return;
        props.sendMessage(messageText.current.value)
        // createMessagePlaceholder(messageText.current.value)
        messageText.current.value = "";
    }

    // const createMessagePlaceholder = (message) => {

    // }

    const receiveMessage = (room) => {
        if (room.id == activeRoom.id) {
            getChatroom(activeRoom.id)
        }
    }

    useEffect(() => {
        if (!props.openChatMenu){
            iconRef.current.className = "fa-solid fa-chevron-right mr-10"
        } else {
            iconRef.current.className = "fa-solid fa-chevron-left mr-10"
        }
    })

    useEffect(() => {

        if (props.socket) {
            props.socket.on("newMessage", receiveMessage)
            return () => {
                props.socket.off("newMessage", receiveMessage)
            }
        }
    }, [])

    useEffect(() => {
        if (activeRoom) {
            getChatroom(activeRoom.id);
        }
    }, [props]) 

    return (
        <div ref={chatBoxRef} className={styles.chatBox}>
            <div className={styles.chatboxHeader}>
                <div className='box-back' onClick={chatMenuHandler}><i ref={iconRef} className="fa-solid fa-chevron-right mr-10" style={{ cursor: "pointer" }}></i>Chat</div><strong>{name}</strong>
            </div>
            <div className={styles.chatboxBody}>
                {messages.map((message, idx) => 
                    <ChatMessage key={idx} message={message} sendByUser={message.createdBy == props.userId} />
                )}
            </div>
            <div className={styles.chatboxFooter}>
                <div className='d-flex align-items-end'>
                    <textarea ref={messageText} maxLength="255" onChange={resizeMessageInput} onKeyDown={keyDownOnInput}></textarea>
                    <button className='btn btn-primary'><i className="fa-solid fa-paper-plane" onClick={handleMessageSend}></i></button>
                </div>
            </div>

        </div>
    )
}
