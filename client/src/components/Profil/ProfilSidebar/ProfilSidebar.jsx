import React, { useEffect, useState, useRef } from 'react'
import ProfilItem from '../ProfilItem/ProfilItem'
import styles from '../ProfilItem/profilItem.module.scss'

export default function ProfilSidebar(props) {
    const sidebarRef = props.sidebarRef

    const sidebarHandler = () => props.setOpenSidebarMenu(!props.openSidebarMenu)


    return (
        <div ref={sidebarRef} className='sidebar-page'>            
            {props.userList &&
            <div className="sidebar-body">
                <div id={0} onClick={(e) => props.getUserId(e)} className={styles.profilItem}>
                    <span>La Kooloc</span>
                </div>
                <div>
                {
                    props.userList.map((user, key) => {
                        return <ProfilItem getUserId={props.getUserId} key={key} user={user}/>  
                    })
                }
                </div>
            </div>
            }
            
        </div>
    )
}
