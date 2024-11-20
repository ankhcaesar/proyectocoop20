import styles from "./Historial.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"
import Botton from "../../components/Botton/Index"
import { useContext } from "react"
import { GlobalContext } from "../../context/GlobalContext"
function Historial() {

    const { ir } = useContext(GlobalContext)

    return (
        <section className={styles.contenedorHistorial}>
            <Header titulo="Historial de compras" />
            <div className={styles.planilla}>

                <div className={styles.titulos}>
                    <div><p>Cod Compra</p></div>
                    <div><p>Fecha</p></div>
                    <div><p>Total</p></div>
                </div>
                <div className={styles.detalle}>
                    <p>aqui detalle desde api</p>
                </div>
            </div>
            <div className={styles.botones}>
                <Botton mane="Nueva Compra"
                    label="NUEVA COMPRA"
                    type="Button"
                    medida="40%"
                    onClick={() => ir("CarritoCompras")}
                />
                <Botton mane="Volver"
                    label="VOLVER"
                    type="Button"
                    medida="40%"
                    onClick={() => ir("MenuCompras")}
                />
            </div>
        </section>
    )
} export default Protegido(Historial)