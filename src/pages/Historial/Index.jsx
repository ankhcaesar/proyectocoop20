import styles from "./Historial.module.css"
import Header from "../../components/Header/Index"
import Protegido from "../../context/Protegido"
import Botton from "../../components/Botton/Index"
import { useContext } from "react"
import { GlobalContext } from "../../context/GlobalContext"

import { useState, useEffect } from "react";
import db from "../../db/db"

function Historial() {

    const { ir, idVenta, formatomoneda } = useContext(GlobalContext)
    const [historial, setHistorial] = useState([]);

    /**traigo los datos */
    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const data = await db.historial.toArray();
                setHistorial(data);
            } catch (error) {
                console.error("Error al obtener el historial:", error);
            }
        };

        fetchHistorial();
    }, []);
    /**traigo los datos */

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


                    {historial.length > 0 ? (
                        historial.map((item) => (
                            <div key={item.id_historial} className={styles.registro}>
                                <div><p>{item.cod_compra}</p></div>
                                <div><p>{new Date(item.fecha).toLocaleDateString()}</p></div>
                                {/*<div><p>${formatomoneda(item.total.toFixed(2))}</p></div> */}
                            </div>
                        ))
                    ) : (
                        <p>Aun no hay registros en el historial.</p>
                    )}

                </div>

            </div>
            <div className={styles.botones}>
                <Botton mane="Nueva Compra"
                    label={!idVenta ? "NUEVA COMPRA" : "IR AL CARRITO"}
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