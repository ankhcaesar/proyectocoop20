import { useContext, useEffect, useState } from "react"
import Botton from "../../components/Botton/Index"
import Header from "../../components/Header/Index"
import styles from "./FinCompra.module.css"
import { GlobalContext } from "../../context/GlobalContext"
import db from "../../db/db"
import PopUpConfirm from "../../components/PopUpConfirm/Index"


function FinCompra() {

    // Variables
    const { ir, idVenta, setIdVenta, statusVenta, setStatusVenta, formatomoneda, setPopUp, nombreyApellido, popUpConfirm, setPopUpConfirm, limpiarPopUpConfirm, } = useContext(GlobalContext);
    const [listaProds, setListaProds] = useState([]);
    const [ventaData, setVentaData] = useState(0);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [productosVenta, datosVenta, settingData] = await Promise.all([
                    db.lista_prods.where("id_venta").equals(idVenta).toArray(),
                    db.ventas.where("id_venta").equals(idVenta).first(),
                    db.settings.toArray(),
                ]);


                if (!productosVenta.length || !datosVenta) return;

                const fecha = new Date(datosVenta.fecha).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
                setVentaData({ ...datosVenta, fecha });

                const productosConDatos = await Promise.all(
                    productosVenta.map(async (prod) => {
                        const articulo = await db.articulos.get(prod.id_art);
                        return articulo
                            ? {
                                ...prod,
                                nombre: articulo.nombre_art || "Desconocido",
                                descripcion: articulo.descripcion_art || "Sin descripción",
                            }
                            : null;
                    })
                );
                setListaProds(productosConDatos.filter(Boolean));
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        cargarDatos();
    }, [idVenta]);
    
    const totalCompra = listaProds.reduce((acc, prod) => acc + prod.total_valor, 0).toFixed(2);


    function manejoFinCompra() {
        setPopUpConfirm({
            show: true,
            from: "TERM",
            data: [{
                medio_pago_0: ventaData.medio_pago_0 || 0,
                medio_pago_1: ventaData.medio_pago_1 || 0,
                medio_pago_2: ventaData.medio_pago_2 || 0,
                totalcompra: totalCompra,
                idVta:idVenta
            }]
        })
    }


    function manejarConfirmar() {

        setPopUpConfirm({
            show: true,
            from: "CNFV",
            data: [{
                medio_pago_0: ventaData.medio_pago_0 || 0,
                medio_pago_1: ventaData.medio_pago_1 || 0,
                medio_pago_2: ventaData.medio_pago_2 || 0,
                totalcompra: totalCompra
            }]
        })
    }

    return (
        <section className={styles.contenedorFinCompra}>

            <Header titulo="Detalle de la compra" />

            <div className={styles.resumen}>
                <div className={styles.datos}>
                    <h2 className={styles.unidabast}>UNIDAD DE ABASTECIMIENTO</h2>
                    <ul className={styles.listadatos}>
                        <li className={styles.items}><span>Nombre: </span>{nombreyApellido}</li>
                        <li className={styles.items}><span>Venta nº: </span>{idVenta}</li>
                        <li className={styles.items}><span>Fecha: </span> {ventaData ? ventaData.fecha : "Cargando..."}</li>
                        <li className={styles.items}><span>Efectivo: </span> {ventaData ? formatomoneda(ventaData.medio_pago_0) : "Cargando..."}</li>
                        <li className={styles.items}><span>Transferencia: </span> {ventaData ? formatomoneda(ventaData.medio_pago_1) : "Cargando..."}</li>
                        <li className={styles.items}><span>Cta Cte: </span> {ventaData ? formatomoneda(ventaData.medio_pago_2) : "Cargando..."}</li>
                        <li className={styles.items}><span>Productos: </span> {listaProds.length}</li>
                        <li className={styles.items}> <span>Unidades:</span> {listaProds.reduce((acc, prod) => acc + prod.cant, 0)}</li>

                    </ul>
                </div>
                <div className={styles.detalle}>
                    <div className={styles.titulos}>
                        <p className={styles.tituloProducto}>Producto</p><p className={styles.tituloCant}>Cant</p><p className={styles.tituloValorunit}>STotal</p><p className={styles.tituloTotal}>Total</p>
                    </div>

                    <div className={styles.articulos}>
                        {listaProds.length > 0 ? (
                            listaProds.map((prod) => (
                                <div key={prod.id_lista_prods} className={styles.registro}>
                                    <p className={styles.registroNombre}>{prod.nombre}</p>
                                    <p className={styles.registroCant}>{prod.cant}</p>
                                    <p className={styles.registroValorunit}>{formatomoneda(prod.valor_unit)}</p>
                                    <p className={styles.regitroTotal}>{formatomoneda(prod.total_valor)}</p>
                                </div>

                            ))
                        ) : (
                            <p>No se encontraron productos</p>
                        )}
                    </div>

                </div>
                <p className={styles.totalcompra}><span>TOTAL:</span>{formatomoneda(totalCompra)}</p>

            </div>

            <div className={styles.botones}>
                <Botton mane="Pagos" label="PAGO" type="Button" medida="40%" onClick={manejarConfirmar} />
                <Botton mane="FinCompra" label="TERMINAR" type="Button" medida="40%" onClick={manejoFinCompra} />
            </div>
            {popUpConfirm.show && <PopUpConfirm from={popUpConfirm.from} data={popUpConfirm.data} onClose={limpiarPopUpConfirm} />}

        </section>
    );
}

export default FinCompra;