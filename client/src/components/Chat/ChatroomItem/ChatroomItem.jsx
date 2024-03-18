import React from 'react'
import styles from "./chatroomitem.module.scss"

function ChatroomItem(props) {
  return (
    <div id={props.chatroom.id} onClick={() => props.setSelectedChatroom(props.chatroom.id)} className={styles.chatroomItem}>
        {props.chatroom.isPrivate &&
          <i className='fa-solid fa-lock' style={{margin : '2px', marginRight : '2px'}}></i>
        }
        <span>{ props.chatroom.name }</span>
        {/* {(props.chatroom.CreatedBy === props.userId || props.chatroom.CreatedBy === null)&&
          <i className="fa-solid fa-trash" style={{ float : 'right'}} onClick={() => props.deleteChatroom(props.chatroom.id)}></i>
        } */}
    </div>
  )
}

export default ChatroomItem