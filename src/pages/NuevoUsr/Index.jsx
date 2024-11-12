import styles from "./NuevoUsr.module.css"
import Header from "../../components/Header/Index"
import { useContext } from "react"
import Protegido from "../../context/Protegido"


function NuevoUsr() {
    return (
        <>
            <h1>nuevo usuario Activo</h1>
        </>
    )
}
export default Protegido(NuevoUsr)