import React, { useEffect } from 'react'
import styles from "./chatmessage.module.scss"
import getFormatedDate from '../../../utils/date'

function ChatMessage({ message, sendByUser }) {

  return (
    <div className={[sendByUser ? styles.sendByUser : styles.sendByOther, styles.messageBox].join(" ")}>
      <div className={styles.message}>
        {!sendByUser && <p className={[styles.messageInfo, styles.messageName].join(" ")}>{message.user.firstName} {message.user.lastName}</p>}
        <p >{message.content}</p>
      </div>
      <p className={styles.messageInfo}>
        {getFormatedDate(message.createdAt)}
      </p>
    </div>
  )
}

export default ChatMessage