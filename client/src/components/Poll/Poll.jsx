import React, { useEffect, useState, useRef } from 'react'
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import PollBox from './PollBox/PollBox'
import PollSidebar from './PollSidebar/PollSidebar'

function Poll() {
  const [openSidebarMenu, setOpenSidebarMenu] = useState(true)

  const [choices, setChoices] = useState([{ id: 0, text: "" }])
  const [id, setId] = useState(1)
  const [context, setContext] = useOutletContext();
  const [createMode, setCreateMode] = useState(false);
  const [polls, setPolls] = useState(false);
  const [pollDetail, setPollDetail] = useState(null);
  const [votes, setVotes] = useState([])
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [votedIds, setVotedIds] = useState(false)
  const [chartData,setChartData] = useState(null)


  const params = useParams()
  const navigate = useNavigate()

  const getPolls = () => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.REACT_APP_SOCKET_URL}/polls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorisation': `BEARER ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setPolls(data)
      })
      .catch(err => console.log(err))
  }

  const getChart = (pollId) => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.REACT_APP_SOCKET_URL}/polls/chart/${pollId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorisation': `BEARER ${token}`
      },
    })
      .then(res => res.json())
      .then(data => {
        setChartData(data)
      })
      .catch(err => console.log(err))
  }
  
  useEffect(() => {
    if (context.socket) {
      context.socket.on("newPoll", (data) => {
        getPolls()
      })
      context.socket.on("newPollSelect", (data) => {
        navigate("/dashboard/polls/" + data.id)

      })

      context.socket.on("updateAfterVote", (data) => {
        window.location.reload()
      })

      context.socket.on("deletePoll", (data) => {
        getPolls()
        setPollDetail(null)
        navigate("/dashboard/polls/")
      })
    }
  }, [context.socket])




  const getPollDetail = (id) => {
    const token = localStorage.getItem("token")
    fetch(`${process.env.REACT_APP_SOCKET_URL}/polls/` + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorisation': `BEARER ${token}`
      },
    })
      .then(res => res.json())
      .then(data => {
        setPollDetail(data.poll)
        setAlreadyVoted(data.alreadyVoted)
        setVotedIds(data.voteIds)
        getChart(data.poll.id)

      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (params.id) {
      getPollDetail(params.id)
    }
  }, [params.id])


  const addChoice = () => {
    if (choices.length < 10) {
      setChoices([...choices, { id: id, text: "" }]);
    }
    setId(prev => prev + 1)
  };

  const handleChange = (e, i) => {
    const newChoice = [...choices];
    newChoice[i].text = e.target.value;

    setChoices(newChoice);
  };


  const handleSubmit = (name) => {
    let payload = {
      question: name.current.value,
      choices: choices,
      houseShareId: context.user.houseShareId,
      userId: context.user.id
    }
    context.socket.emit("newPoll", payload)
    setCreateMode(false)

  };

  const handleDelete = (e) => {
    const newChoices = choices.filter((c) => c.id !== +e.currentTarget.id);
    setChoices(newChoices);
  };

  const handleDeletePoll = (e, id) => {
    e.stopPropagation();
    if (context.socket) {
      context.socket.emit("deletePoll", { id })
    }
  }

  const handleSubmitVote = (e) => {
    if (votes.length <= 0) {
      return
    }
    if (context.socket) {
      context.socket.emit("newVote", { votes: votes, pollId: params.id, userId: context.user.id })
    }
  }



  let sidebarRef = useRef(null)
  let boxRef = useRef(null)

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

  useEffect(() => {
    getPolls()
  }, [])

  return (
    <div className='content-page'>
      <PollSidebar
        openSidebarMenu={openSidebarMenu}
        sidebarRef={sidebarRef}
        setOpenSidebarMenu={setOpenSidebarMenu}
        choices={choices}
        addChoice={addChoice}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        createMode={createMode}
        setCreateMode={setCreateMode}
        polls={polls}
        setVotes={setVotes}
        context={context}
        handleDeletePoll={handleDeletePoll}
      />
      <PollBox
        pollDetail={pollDetail}
        setOpenSidebarMenu={setOpenSidebarMenu}
        boxRef={boxRef}
        openSidebarMenu={openSidebarMenu}
        setVotes={setVotes}
        votes={votes}
        handleSubmitVote={handleSubmitVote}
        alreadyVoted={alreadyVoted}
        votedIds={votedIds}
        getChart={getChart}
        chartData={chartData}


      />
    </div>

  )
}

export default Poll