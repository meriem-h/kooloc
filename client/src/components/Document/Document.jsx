import React, { useEffect, useState, useRef } from 'react'
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import DocumentSidebar from './DocumentSidebar/DocumentSidebar'
import DocumentBox from "./DocumentBox/DocumentBox"


function Document() {
  const [openSidebarMenu, setOpenSidebarMenu] = useState(true)
  const [context, setContext] = useOutletContext();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState(null);
  const [fileDetail, setFileDetail] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const params = useParams();

  let sidebarRef = useRef(null)
  let boxRef = useRef(null)

  const navigate = useNavigate()

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDeleteFile = (event) => {
    if (fileInfo) {
      context.socket.emit("deleteFile", { id: fileInfo.id, fileName: fileInfo.name })
      setAddMode(false)
    }
  }

  const handleFileSubmit = (event) => {
    event.preventDefault();
    if (file) {
      context.socket.emit("upload", { buffer: file, name: file.name, size: file.size,userId:context.user.id,houseShareId:context.user.houseShareId })
      setAddMode(false)
    }
  };

  const getDocument = () => {
    const token = localStorage.getItem("token")
    console.log(token)
    fetch(`${process.env.REACT_APP_SOCKET_URL}/documents?userId=${context.user.id}&id=${context.user.houseShareId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorisation': `BEARER ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setFiles(data)
      })
      .catch(err => console.log(err))
  }

  const getDocumentDetail = (id) => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.REACT_APP_SOCKET_URL}/documents/` + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorisation': `BEARER ${token}`
      }
    })
      .then(res => res.blob())
      .then(data => {
        const url = URL.createObjectURL(data);
        setFileDetail(url)
        setFileInfo(files.filter(x => x.id == id)[0])
        console.log(files.filter(x => x.id == id)[0])
      })
      .catch(err => console.log(err))
  }

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

  useEffect(() => {
    getDocument();
    context.socket.on("newDocument", (data) => {
      getDocument();
      console.log("newDocuement")
      console.log(data)

    })
    context.socket.on("deleteFile", (data) => {
      getDocument();
      window.location.reload();
    })
  }, [])

  useEffect(() => {
    if (params.id) {
      console.log('params :', params.id)
      getDocumentDetail(params.id)
    }
  }, [params.id])


  window.onresize = () => {
    if (window.innerWidth > 975) {
      setOpenSidebarMenu(true)
    } else {
      setOpenSidebarMenu(false)
    }
  };

  return (
    <div className='content-page'>
      <DocumentSidebar
        setAddMode={setAddMode}
        addMode={addMode}
        files={files}
        handleFileChange={handleFileChange}
        handleFileSubmit={handleFileSubmit}
        openSidebarMenu={openSidebarMenu}
        sidebarRef={sidebarRef}
        setOpenSidebarMenu={setOpenSidebarMenu}
        fileInfo={fileInfo}
      />

      <DocumentBox
        fileDetail={fileDetail}
        setOpenSidebarMenu={setOpenSidebarMenu}
        boxRef={boxRef}
        openSidebarMenu={openSidebarMenu}
        fileInfo={fileInfo}
        handleDeleteFile={handleDeleteFile}

      />
    </div>

  )
}

export default Document