import { useContext, useEffect, useState } from "react"
import Botton from "../../components/Botton/Index"
import Header from "../../components/Header/Index"
import styles from "./FinCompra.module.css"
import { GlobalContext } from "../../context/GlobalContext"
import db from "../../db/db"


function FinCompra() {

    // Variables
    const { ir, idVenta, setIdVenta, statusVenta, setStatusVenta, formatomoneda, setPopUp } = useContext(GlobalContext);
    const [listaProds, setListaProds] = useState([]);
    const [ventaData, setVentaData] = useState(null);

    useEffect(() => {
        const cargarProductos = async () => {
            try {

                const productosVenta = await db.lista_prods.where("id_venta").equals(idVenta).toArray();

                if (productosVenta.length === 0) {
                    setListaProds([]);
                    return;
                }

                const datosVenta = await db.ventas.where("id_venta").equals(idVenta).toArray();
                if (datosVenta.length > 0) {
                    // Formatear la fecha en formato DD/MM/YYYY
                    const fechaFormateada = new Date(datosVenta[0].fecha);
                    const fecha = `${String(fechaFormateada.getDate()).padStart(2, '0')}/${String(fechaFormateada.getMonth() + 1).padStart(2, '0')}/${fechaFormateada.getFullYear()}`;
                    setVentaData({ ...datosVenta[0], fecha: fecha });
                }

                // Combinar datos de lista_prods con articulos
                const productosConDatos = await Promise.all(
                    productosVenta.map(async (prod) => {
                        const articulo = await db.articulos.get(prod.id_art);
                        if (!articulo) return null;

                        return {
                            id_lista_prods: prod.id_lista_prods,
                            id_art: prod.id_art,
                            nombre: articulo.nombre_art || "Desconocido",
                            descripcion: articulo.descripcion_art || "Sin descripción",
                            valor_unit: prod.valor_unit,
                            cant: prod.cant,
                            total_valor: prod.total_valor,
                        };
                    })
                );

                // Filtrar nulos y actualizar el estado
                setListaProds(productosConDatos.filter((item) => item !== null));
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };

        cargarProductos();
    }, [idVenta, statusVenta, ir]);

    return (
        <section className={styles.contenedorFinCompra}>
            <Header titulo="Historial de compras" />
            <div className={styles.resumen}>
                <div className={styles.datos}>
                    <h2>UNIDAD DE ABASTECIMIENTO</h2>
                    <div>
                        <p>Venta nº :{idVenta}</p>
                        {/* Aquí mostramos la fecha desde ventaData */}
                        <p>Fecha: {ventaData ? ventaData.fecha : "Cargando..."}</p>
                    </div>

                    <div className={styles.pago}>
                        {/* Mostrar los métodos de pago si están definidos */}
                        <p>Efectivo: {ventaData ? ventaData.medpago0 : "Cargando..."}</p>
                        <p>Transferencia: {ventaData ? ventaData.medpago1 : "Cargando..."}</p>
                        <p>Cta Cte: {ventaData ? ventaData.medpago2 : "Cargando..."}</p>

                        <p>Total compra:{" "}
                            {formatomoneda(
                                listaProds.reduce((acc, prod) => acc + prod.total_valor, 0).toFixed(2)
                            )}
                        </p>
                    </div>
                    <div className={styles.totales}>
                        <p>Total productos: {listaProds.length}</p>
                        <p>Total unidades: {listaProds.reduce((acc, prod) => acc + prod.cant, 0)}</p>
                    </div>
                </div>
                <div className={styles.detalle}>
                    <div className={styles.titulos}>
                        <p className={styles.producto}>Producto</p>
                        <p className={styles.cantidad}>Cantidad</p>
                        <p className={styles.subtotal}>SubTotal</p>
                        <p className={styles.total}>Total</p>
                    </div>
                    
                    <div className={styles.articulos}>
                        {listaProds.length > 0 ? (
                            listaProds.map((prod) => (
                                <div key={prod.id_lista_prods} className={styles.registro}>
                                    <div className={styles.nombreArt}><p>{prod.nombre}</p></div>
                                    <div className={styles.cantArt}><p>{prod.cant}</p></div>
                                    <div className={styles.valorUnitArt}><p>{formatomoneda(prod.valor_unit)}</p></div>
                                    <div className={styles.valorTotalArt}><p>{formatomoneda(prod.total_valor)}</p></div>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron productos</p>
                        )}
                    </div>
                </div>

            </div>

            <div className={styles.botones}>
                <Botton mane="Volver" label="VOLVER" type="Button" medida="40%" onClick={() => ir("CarritoCompras")} />
                <Botton mane="Confirmar" label="CONFIRMAR" type="Button" medida="40%" />
            </div>
        </section>
    );
}

export default FinCompra;
