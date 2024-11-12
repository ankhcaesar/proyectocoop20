import styles from "./E404.module.css"
import { Link } from "react-router-dom"

function E404 (){
    return(
        <>
        <h1>¿Perdido?</h1>
        <Link to="/">Ir al inicio</Link>
        </>
    )
}
export default  E404