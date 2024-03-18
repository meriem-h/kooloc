import React, { useRef } from 'react'
import styles from "./chatsidebar.module.scss"
import ChatroomItem from '../ChatroomItem/ChatroomItem'

function ChatSideBar(props) {

  const formRef = useRef(null)
  const btnRef = useRef(null)
  const inputRef = useRef(null)
  const checkRef = useRef(null)
  
  let sidebarRef = props.sidebarRef

  const sidebarChatHandler = () => {
    let setOpenChatMenu = props.setOpenChatMenu;
    let openChatMenu = props.openChatMenu;

    setOpenChatMenu(!openChatMenu)
  }

  const createListHandler = () => {
    btnRef.current.classList.add('d-none');
    formRef.current.classList.remove('d-none');
    inputRef.current.focus();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      btnRef.current.classList.remove('d-none');
      formRef.current.classList.add('d-none');
    }
  }
  
  const submitHandler = (e) => {
    e.preventDefault();
    const chatroomName = inputRef.current.value;
    const isPrivate = checkRef.current.checked;
    props.addChatroom(chatroomName, isPrivate);
    inputRef.current.value = "";
    
    btnRef.current.classList.remove('d-none');
    formRef.current.classList.add('d-none');
  }

  return (
    <div ref={sidebarRef} className={styles.chatSidebar}>
      <div className={styles.chatSidebarHeader}>
        <i className="fa-solid fa-magnifying-glass pl-10" style={{ backgroundColor: "#efefef", height: 43 }}></i>
        <input className={styles.chatSearch} type="text" />
        {
          window.innerWidth < 975 ?
            <i onClick={sidebarChatHandler} className="fa-solid fa-chevron-left ml-5" style={{ cursor: "pointer" }}></i>
            :
            ""
        }
      </div>
      <div className={styles.chatSidebarBody}>
        {
          props.chatroomList.map((chatroom, key) => 
            <ChatroomItem key={key} chatroom={chatroom} userId={props.userId} setSelectedChatroom={props.setSelectedChatroom} deleteChatroom={props.deleteChatroom} />
          )
        }
      </div>
      <div className={styles.chatSidebarFooter}>
        <button ref={btnRef} className='btn btn-primary' onClick={createListHandler}>Creer une conversation <i className="fa-solid fa-square-plus ml-10"></i></button>
        <form ref={formRef} onSubmit={(e) => submitHandler(e)} action="" className='d-flex d-none'>
          <div style={{ display : 'flex', flexDirection : 'column', margin : '2px', alignItems : 'center'}}>
            <div>Privée </div>
            <input ref={checkRef} type="checkbox" />
          </div>
          <input ref={inputRef} type="text" onKeyDown={handleInputKeyDown} />
          <button className='btn btn-primary'><i className="fa-solid fa-floppy-disk"></i></button>
        </form>
      </div>
    </div>
  )
}

export default ChatSideBar