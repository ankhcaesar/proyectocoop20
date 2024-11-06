import styles from "./Botton.module.css"

function Botton(props) {
    return (

        <button
            className={styles.boton} 
            style={{width:`${props.medida}`}}
            type={props.type}
            onClick={props.onClick}

        >{props.label}
        </button>
    )
}
export default Botton