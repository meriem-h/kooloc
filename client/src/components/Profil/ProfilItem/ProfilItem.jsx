import styles from './profilItem.module.scss'

export default function ProfilItem(props){

    return (
        <div id={props.user.id} onClick={(e) => props.getUserId(e)} className={styles.profilItem}>
            <span>{ props.user.firstName } { props.user.lastName}</span>
        </div>
    )
}