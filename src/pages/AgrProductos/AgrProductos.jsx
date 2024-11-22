import styles from "./AgrProductos.module.css"
import Botton from "../../components/Botton/Index"
import Header from "../../components/Header/Index"
import { useState } from "react"
import IngresoQr from "../../components/IngresoQr/IngresoQr"
import IngresoManual from "../../components/IngresoManual/IngresoManual"

function AgrProductos() {

    const [tipoIngreso, setTipoIngreso] = useState(true);

    return (
        <section className={styles.contenedorArgProductos}>
            <Header titulo="Carrito de compras" />

            <div className={styles.container}>
                {tipoIngreso === true ? <IngresoQr /> : <IngresoManual />}

            </div>
            <div className={styles.botones}>
                <Botton mane="Ing Manual"
                    label={tipoIngreso === true? "INGRESO MANUAL" : "LECTOR QR"}
                    type="Button"
                    medida=""
                    onClick={() => setTipoIngreso((prev) => !prev)}
                />
            </div>



        </section>
    )
} export default AgrProductos