import React, { useEffect, useState, useRef } from 'react'
import { useOutletContext } from 'react-router-dom';
import styles from './profilBox.module.scss';

export default function ProfilBox(props) {
    // eslint-disable-next-line
    const [context, setContext] = useOutletContext();
    const [user, setUser] = useState({})


    const users = context.user?.houseShare?.users;
    const house = context.user?.houseShare

    let boxRef = props.boxRef
    const iconRef = useRef(null)
    const phoneRef = useRef(null);
    

    const sidebarMenuHandler = () => {
        let setOpenSidebarMenu = props.setOpenSidebarMenu;
        let openSidebarMenu = props.openSidebarMenu;
        setOpenSidebarMenu(!openSidebarMenu)
    }

    const handleUpdatePhone = () => {
        const token = localStorage.getItem('token');
    
        const payload = {
            id: user.id,
            phone: phoneRef.current?.value
        }

        if (token && payload.phone.length > 0) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorisation': `BEARER ${token}`
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then((res) => {
                if(res === "OK"){
                    window.location.reload()
                }
            })

        }
    }

    const handleQuitColoc = () => {
        const token = localStorage.getItem('token');

        const payload = {
            userId : user.id,
            houseId : house.id
        }

        if(window.confirm('êtes-vous sur de vouloir quitter la Kouloc ?')){
            if (token && payload) {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/user/quit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorisation': `BEARER ${token}`
                    },
                    body: JSON.stringify(payload)
    
                })
                .then(res => res.json())
                .then((res) => {
                    if(res === "OK"){
                        localStorage.removeItem('token');
                        window.location.reload()
                    }
                })
    
            }  

        }
       
    }

    useEffect(() => {
        const users = context.user?.houseShare?.users;
        const house = context.user?.houseShare

        if (props.openSidebarMenu) {
            iconRef.current.className = "fa-solid fa-chevron-right mr-10"
        } else {
            iconRef.current.className = "fa-solid fa-chevron-left mr-10"
        }

        if(users){
            users.forEach((user)=> {
                if(+user.id === +props.selectedUserId){
                    setUser(user)
                }
    
            })    

        }
      

    }, [context, props.selectedUserId, user])

    return (
       
        <div ref={boxRef} className='box-page'>
            <div className="box-header">
                <div className='box-back' onClick={sidebarMenuHandler}>
                <i ref={iconRef} className="fa-solid fa-chevron-right mr-10" style={{ cursor: "pointer" }}></i>
                Utilisateurs
                </div>
                <>
                    {(props.house && user)?
                        <strong>La Kouloc</strong>
                        :
                        <strong>{user.firstName}</strong>
                    }
                </>
            </div>
            <div className='box-body profil-body'>
            {(props.house && user)?
                <>
                {(house) &&
                <div className={styles.profilBody}>
                <h2>{house.name}</h2>
                    <div>
                        <label>depuis le :</label> 
                        <input type='text' value={`${house.createdAt.substring(0, 10)}`} readOnly />
                    </div>
                    <div>
                        <label>code de la kouloc :</label> 
                        <input type="text" value={`${house.uui}`} readOnly/>
                    </div>
                </div>
                }
                </>
                :
                <div className={styles.profilBody}>
                    <div>
                        <label>Nom Prénom :</label>
                        <input type='text' value={`${user.lastName} ${user.firstName}`} readOnly/>
                    </div>
                    <div>
                        <label>E-mail :</label>
                        <input type='text' value={`${user.email}`} readOnly/>
                    </div>
                    <div>
                        <label>Téléphone :</label>
                        {(context.user.id === user.id) ?
                            <>
                                <input ref={phoneRef} type='tel' pattern="([0-9]{2}[\s]){4}[0-9]{2}" placeholder={`${user.phone}`}/>

                                <div className={styles.enregistrer}>
                                    <div className='btn btn-success' onClick={handleUpdatePhone} style={{padding : '10px'}}>Enregistrer</div>
                                </div>
                                <div className={styles.enregistrer}>
                                    <div className='btn btn-danger' onClick={handleQuitColoc} style={{padding : '10px'}}>Quitter la Kooloc</div>
                                </div>
                            </>

                        :
                            <input type='text' value={`${user.phone}`} readOnly/>
                        }
                    </div>
                </div>
            }
            </div>
        </div>
    )
}
