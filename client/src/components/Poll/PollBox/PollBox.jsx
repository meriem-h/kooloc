import React, { useRef, useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chart.js';

import styles from "./pollbox.module.scss"


function PollBox(props) {


  useEffect(() => {
    if (props.chartData) {
      let data = props.chartData.data
      let dataNbVote = []
      let labelData = []

      data.votes.map(v => {
        dataNbVote.push(v.nbVotes)
        labelData.push(v.choix)
      })
      let chart = {
        labels: labelData,
        datasets: [
          {
            label: data.question,
            data: dataNbVote
          },
        ],
      }
  
      setChartData(chart)
    }



  }, [props.chartData])


  const [chartData, setChartData] = useState();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  let boxRef = props.boxRef

  const sidebarMenuHandler = () => {
    let setOpenSidebarMenu = props.setOpenSidebarMenu;
    let openSidebarMenu = props.openSidebarMenu;

    setOpenSidebarMenu(!openSidebarMenu)
  }


  const handleVote = (e) => {

    let payload = {
      id: e.target.value,
      checked: e.target.checked
    }

    if (payload.checked === true) {
      props.setVotes(prevState => [...prevState, payload])
    } else {
      let newVote = props.votes.filter(v => v.id !== e.target.value)

      props.setVotes(newVote)
    }
  }

  const iconRef = useRef(null)
  useEffect(() => {
    if (props.openChatMenu) {
      iconRef.current.className = "fa-solid fa-chevron-right mr-10"
    } else {
      iconRef.current.className = "fa-solid fa-chevron-left mr-10"
    }
  })

  return (
    <div ref={boxRef} className='box-page'>
      <div className="box-header">
        <div className='box-back' onClick={sidebarMenuHandler}><i ref={iconRef} className="fa-solid fa-chevron-right mr-10" style={{ cursor: "pointer" }}></i>Sondages</div>
      </div>
      <div className="box-body">
        {
          props.pollDetail ?
            <div>
              <h1 className='p-20 d-flex justify-content-center'>{props.pollDetail.question}</h1>
              <div className='p-20'>
                <div className='d-flex justify-content-center'>
                  {
                    props.pollDetail.choices.map((c, key) =>
                      !props.alreadyVoted ?
                        <div key={c.id}>
                          <input onChange={(e) => { handleVote(e) }} value={c.id} style={{ width: "auto" }} type="checkbox" className={styles.hiddenCheckbox} name={'choice_' + c.id} id={c.id} />
                          <label htmlFor={c.id}>{c.title}</label>
                        </div>
                        :
                        <div key={c.id} className={props.votedIds?.filter(id => id !== c.id).length > 0 ? styles.voteBtn : styles.noVoteBtn}>{c.title}</div>
                    )

                  }
                </div>
              </div>
              <div style={{ height: 600 }} className="d-flex justify-content-center mt-20">
                {
                  chartData ?
                  <Pie data={chartData} />
                  :
                  null
                }
              </div>
            </div>

            :
            null
        }
      </div>
      {
        !props.alreadyVoted ?

          <div className="box-footer d-flex justify-content-center"><button onClick={props.handleSubmitVote} style={{ color: "#000" }} className='btn btn-primary success'>Valider mon choix !</button></div>
          :
          null

      }
    </div>
  )
}

export default PollBox