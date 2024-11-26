import styles from "./AgrProductos.module.css"
import Botton from "../../components/Botton/Index"
import Header from "../../components/Header/Index"
import { useContext, useState } from "react"
import IngresoQr from "../../components/IngresoQr/IngresoQr"
import IngresoManual from "../../components/IngresoManual/Index"
import PopUpConfirm from "../../components/PopUpConfirm/Index"
import { GlobalContext } from "../../context/GlobalContext"

function AgrProductos() {

    const { popUpConfirm, limpiarPopUpConfirm } = useContext(GlobalContext)

    const [tipoIngreso, setTipoIngreso] = useState(true);

    return (
        <section className={styles.contenedorArgProductos}>
            <Header titulo="Carrito de compras" />

            <div className={styles.container}>
                {tipoIngreso === true ? <IngresoQr /> : <IngresoManual />}

            </div>
            <div className={styles.botones}>
                <Botton mane="Ing Manual"
                    label={tipoIngreso === true ? "INGRESO MANUAL" : "LECTOR QR"}
                    type="Button"
                    medida=""
                    onClick={() => setTipoIngreso((prev) => !prev)}
                />
            </div>

            {popUpConfirm.show && <PopUpConfirm from={popUpConfirm.from} urlImagen={popUpConfirm.urlImagen} nombre={popUpConfirm.nombre} descripcion={popUpConfirm.descripcion} valor={popUpConfirm.valor} onClose={limpiarPopUpConfirm}/>}
        </section>
    )
} export default AgrProductos