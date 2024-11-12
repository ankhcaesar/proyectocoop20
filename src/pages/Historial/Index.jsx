import styles from "./Historial.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"

function Historial() {

    return (
        <>
            <Header titulo="Historial" />
        </>
    )
}
export default Protegido(Historial)