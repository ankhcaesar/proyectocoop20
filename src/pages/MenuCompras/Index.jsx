import styles from "./MenuCompras.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"
import Botton from "../../components/Botton/Index"
import { useContext } from "react"
import { GlobalContext } from "../../context/GlobalContext"
function MenuCompras() {
    const { ir } = useContext(GlobalContext)

    return (
        <section className={styles.contenedorMenuCompras}>
            <div>
                <Header titulo="Menu de compras" />
            </div>
            <div className={styles.opciones}>

                <Botton
                    mane="Nueva Compra"
                    label="NUEVA COMPRA"
                    type="Button"
                    onClick={() => ir("CarritoCompras")}
                />
                <Botton
                    mane="Historial"
                    label="HISTORIAL"
                    type="Button"
                    onClick={() => ir("Historial")}
                />
                <Botton
                    mane="Salir"
                    label="SALIR"
                    type="Button"
                    onClick={() => ir("salir")}
                />
            </div>

        </ section>
    )
}
export default Protegido(MenuCompras)