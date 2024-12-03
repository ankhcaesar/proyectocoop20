import { useContext } from "react";
import { GlobalContext } from '../../context/GlobalContext';
import styles from "./PopUpConfirm.module.css";
import iconoOk from "/Icons/check_blanco.svg";
import tachito from "/Icons/tachito_blanco.svg";
import db from "../../db/db";

function PopUpConfirm({ id, from, urlImagen, nombre, descripcion, valor, onClose }) {
    const { setPopUp, idVenta, limpiarPopUp } = useContext(GlobalContext);

    const agregarProducto = async () => {
        try {
            // Buscar si el producto ya existe en la tabla lista_prods con el mismo id_venta y id_art
            const productoExistente = await db.lista_prods
                .where("id_venta")
                .equals(idVenta)
                .toArray(); // Traer todos los productos con el mismo id_venta

            // Filtrar por id_art dentro de los productos encontrados
            const producto = productoExistente.find(prod => prod.id_art === id);

            if (producto) {
                // Si el producto existe, actualizamos su cantidad y valor total
                const nuevaCant = producto.cant + 1;
                const nuevoTotalValor = nuevaCant * producto.valor_unit;

                // Actualizamos el producto en la base de datos
                await db.lista_prods.update(producto.id_lista_prods, {
                    cant: nuevaCant,
                    total_valor: nuevoTotalValor
                });
            } else {
                // Si el producto no existe, lo agregamos a la tabla lista_prods
                const nuevoProducto = {
                    id_venta: idVenta,
                    id_art: id,
                    valor_unit: valor,
                    cant: 1,
                    total_valor: valor
                };

                await db.lista_prods.add(nuevoProducto);
            }

            // Mostrar mensaje de éxito en el popup
            setPopUp({
                show: true,
                message: `Producto ${nombre} agregado exitosamente!`,
                type: "ok",
                zeIndex: "98",
                from: "MSJ",
                duration: "2s"
            });

            // Cerrar el PopUp después de 2 segundos
            setTimeout(() => {
                limpiarPopUp();  // Limpiar el PopUp
                onClose();       // Cerrar el PopUp
            }, 2000);
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    };
    return (
        <>
            {from === "AGRP" && (
                <div className={styles.overlay}>
                    <div className={styles.PopUpContainer}>
                        <div className={styles.producto}>
                            <h3 className={styles.nombre}>{nombre}</h3>
                            <img className={styles.imagen} src={urlImagen} alt={`Imagen de ${nombre}`} />
                            <p className={styles.descripcion}>Detalle: {descripcion}</p>
                            <p className={styles.valor}>Valor unitario: {valor}</p>
                        </div>
                        <div className={styles.botton}>
                            <button
                                className={styles.botonok}
                                type="button"
                                onClick={agregarProducto}
                            >
                                <img src={iconoOk} alt="Agregar" />
                            </button>
                            <button
                                className={styles.botoncerrar}
                                type="button"
                                onClick={onClose}
                            >
                                <img src={tachito} alt="Cancelar" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PopUpConfirm;
