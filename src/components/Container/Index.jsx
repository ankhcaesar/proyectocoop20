import styles from "./Container.module.css"
import Cargador from "../../components/Cargador/Index"
import PopUp from "../../components/PopUp/Index"
import { useContext, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext"

function Container({ children }) {

    const {
        popUp, cargador
    } = useContext(GlobalContext)

    return (
        <section className={styles.containerContainer}>
            {children}
            {popUp.show && <PopUp message={popUp.message} type={popUp.type} zeIndex={popUp.zeIndex} from={popUp.from} duration={popUp.duration} />}
            {cargador.show && <Cargador duration={cargador.duration} />}
        </section>

    )
}
export default Container