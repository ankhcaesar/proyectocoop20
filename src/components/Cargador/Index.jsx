import styles from "./Cargador.module.css"

function Cargador({ show, duration }) {
    return (
        < div className={styles.overlay} >
            <div className={styles.cargador}></div>
        </div >

    )
}
export default Cargador